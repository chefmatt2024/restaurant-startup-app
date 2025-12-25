// Sharing and Collaboration Service
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db, authService } from './firebase';

const getAppId = () => 'restaurant-startup-app';

// Permission levels
export const PERMISSION_LEVELS = {
  OWNER: 'owner',
  EDITOR: 'editor',
  VIEWER: 'viewer'
};

// Share a draft with another user
export const shareDraft = async (draftId, email, permission = PERMISSION_LEVELS.VIEWER) => {
  try {
    const appId = getAppId();
    const currentUser = authService.getCurrentUser();
    
    if (!currentUser || !currentUser.uid) {
      throw new Error('User must be authenticated to share drafts');
    }

    // Create share document
    const shareId = `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const shareRef = doc(db, `artifacts/${appId}/shares`, shareId);
    
    await setDoc(shareRef, {
      draftId,
      ownerId: currentUser.uid,
      ownerEmail: currentUser.email,
      sharedWithEmail: email.toLowerCase(),
      permission,
      status: 'pending', // pending, accepted, declined
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Add to draft's sharedWith array
    const draftRef = doc(db, `artifacts/${appId}/users/${currentUser.uid}/drafts`, draftId);
    const draftDoc = await getDoc(draftRef);
    
    if (draftDoc.exists()) {
      const currentShared = draftDoc.data().sharedWith || [];
      await updateDoc(draftRef, {
        sharedWith: arrayUnion({
          email: email.toLowerCase(),
          permission,
          shareId,
          status: 'pending'
        }),
        updatedAt: serverTimestamp()
      });
    }

    return { success: true, shareId };
  } catch (error) {
    console.error('Error sharing draft:', error);
    throw error;
  }
};

// Get all shares for a draft
export const getDraftShares = async (draftId) => {
  try {
    const appId = getAppId();
    const sharesRef = collection(db, `artifacts/${appId}/shares`);
    const q = query(sharesRef, where('draftId', '==', draftId));
    const querySnapshot = await getDocs(q);
    
    const shares = [];
    querySnapshot.forEach((doc) => {
      shares.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return shares;
  } catch (error) {
    console.error('Error getting draft shares:', error);
    return [];
  }
};

// Get all drafts shared with current user
export const getSharedDrafts = async () => {
  try {
    const appId = getAppId();
    const currentUser = authService.getCurrentUser();
    
    if (!currentUser || !currentUser.email) {
      return [];
    }

    const sharesRef = collection(db, `artifacts/${appId}/shares`);
    const q = query(
      sharesRef, 
      where('sharedWithEmail', '==', currentUser.email.toLowerCase()),
      where('status', '==', 'accepted')
    );
    const querySnapshot = await getDocs(q);
    
    const sharedDrafts = [];
    for (const shareDoc of querySnapshot.docs) {
      const shareData = shareDoc.data();
      
      // Get the actual draft
      const draftRef = doc(
        db, 
        `artifacts/${appId}/users/${shareData.ownerId}/drafts`, 
        shareData.draftId
      );
      const draftDoc = await getDoc(draftRef);
      
      if (draftDoc.exists()) {
        sharedDrafts.push({
          ...draftDoc.data(),
          id: draftDoc.id,
          shareId: shareDoc.id,
          permission: shareData.permission,
          ownerEmail: shareData.ownerEmail,
          isShared: true
        });
      }
    }
    
    return sharedDrafts;
  } catch (error) {
    console.error('Error getting shared drafts:', error);
    return [];
  }
};

// Get pending invitations for current user
export const getPendingInvitations = async () => {
  try {
    const appId = getAppId();
    const currentUser = authService.getCurrentUser();
    
    if (!currentUser || !currentUser.email) {
      return [];
    }

    const sharesRef = collection(db, `artifacts/${appId}/shares`);
    const q = query(
      sharesRef, 
      where('sharedWithEmail', '==', currentUser.email.toLowerCase()),
      where('status', '==', 'pending')
    );
    const querySnapshot = await getDocs(q);
    
    const invitations = [];
    querySnapshot.forEach((doc) => {
      invitations.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return invitations;
  } catch (error) {
    console.error('Error getting pending invitations:', error);
    return [];
  }
};

// Accept a share invitation
export const acceptInvitation = async (shareId) => {
  try {
    const appId = getAppId();
    const shareRef = doc(db, `artifacts/${appId}/shares`, shareId);
    
    await updateDoc(shareRef, {
      status: 'accepted',
      acceptedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error accepting invitation:', error);
    throw error;
  }
};

// Decline a share invitation
export const declineInvitation = async (shareId) => {
  try {
    const appId = getAppId();
    const shareRef = doc(db, `artifacts/${appId}/shares`, shareId);
    
    await updateDoc(shareRef, {
      status: 'declined',
      declinedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error declining invitation:', error);
    throw error;
  }
};

// Update share permission
export const updateSharePermission = async (shareId, permission) => {
  try {
    const appId = getAppId();
    const shareRef = doc(db, `artifacts/${appId}/shares`, shareId);
    
    await updateDoc(shareRef, {
      permission,
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating share permission:', error);
    throw error;
  }
};

// Remove share (revoke access)
export const removeShare = async (shareId, draftId) => {
  try {
    const appId = getAppId();
    const currentUser = authService.getCurrentUser();
    
    // Delete share document
    const shareRef = doc(db, `artifacts/${appId}/shares`, shareId);
    await deleteDoc(shareRef);

    // Remove from draft's sharedWith array
    const draftRef = doc(db, `artifacts/${appId}/users/${currentUser.uid}/drafts`, draftId);
    const draftDoc = await getDoc(draftRef);
    
    if (draftDoc.exists()) {
      const currentShared = draftDoc.data().sharedWith || [];
      const updatedShared = currentShared.filter(share => share.shareId !== shareId);
      
      await updateDoc(draftRef, {
        sharedWith: updatedShared,
        updatedAt: serverTimestamp()
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error removing share:', error);
    throw error;
  }
};

// Check if user has permission to edit a draft
export const canEditDraft = async (draftId, userId) => {
  try {
    const appId = getAppId();
    
    // Check if user is owner
    const draftRef = doc(db, `artifacts/${appId}/users/${userId}/drafts`, draftId);
    const draftDoc = await getDoc(draftRef);
    
    if (draftDoc.exists()) {
      return { canEdit: true, permission: PERMISSION_LEVELS.OWNER };
    }

    // Check if user has share access
    const currentUser = authService.getCurrentUser();
    if (!currentUser || !currentUser.email) {
      return { canEdit: false };
    }

    const sharesRef = collection(db, `artifacts/${appId}/shares`);
    const q = query(
      sharesRef,
      where('draftId', '==', draftId),
      where('sharedWithEmail', '==', currentUser.email.toLowerCase()),
      where('status', '==', 'accepted')
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const shareData = querySnapshot.docs[0].data();
      const canEdit = shareData.permission === PERMISSION_LEVELS.EDITOR || 
                     shareData.permission === PERMISSION_LEVELS.OWNER;
      return { canEdit, permission: shareData.permission };
    }

    return { canEdit: false };
  } catch (error) {
    console.error('Error checking edit permission:', error);
    return { canEdit: false };
  }
};

