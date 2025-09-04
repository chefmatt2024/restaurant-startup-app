import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
  linkWithCredential,
  EmailAuthProvider,
  // reauthenticateWithCredential
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  getDocs
} from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = typeof window !== 'undefined' && window.__firebase_config 
  ? JSON.parse(window.__firebase_config) 
  : {
      // Default configuration for development
      apiKey: "AIzaSyDfEzba9busszEbikxRTqWvRTvNRTYe58k",
      authDomain: "restaurant-startup-app.firebaseapp.com",
      projectId: "restaurant-startup-app",
      storageBucket: "restaurant-startup-app.firebasestorage.app",
      messagingSenderId: "712703384904",
      appId: "1:712703384904:web:a7ddf9aa118c9e64c7e77d",
      measurementId: "G-YEMZ8XZT7S"
    };

// Initialize Firebase
let app, auth, db;
let isFirebaseEnabled = false;

try {
  // Check if we have valid Firebase config
  if (firebaseConfig.apiKey && firebaseConfig.projectId && 
      firebaseConfig.apiKey !== 'undefined' && firebaseConfig.projectId !== 'undefined') {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    isFirebaseEnabled = true;
    // console.log('✅ Firebase initialized successfully');
  } else {
    // console.log('🔄 Running in offline mode (no Firebase config)');
  }
} catch (error) {
  // console.error('❌ Firebase initialization failed, running in offline mode:', error);
  isFirebaseEnabled = false;
}

// Authentication service
export const authService = {
  // Sign in anonymously
  signInAnonymously: () => {
    if (isFirebaseEnabled && auth) {
      return signInAnonymously(auth);
    }
    // Offline mode - simulate successful sign in
    return Promise.resolve({ user: { uid: 'offline-user', isAnonymous: true } });
  },
  
  // Sign in with custom token
  signInWithCustomToken: (token) => {
    if (isFirebaseEnabled && auth) {
      return signInWithCustomToken(auth, token);
    }
    return Promise.resolve({ user: { uid: 'offline-user' } });
  },

  // Create user with email and password
  createUserWithEmailAndPassword: (email, password, displayName = '') => {
    if (isFirebaseEnabled && auth) {
      return createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          if (displayName) {
            await updateProfile(userCredential.user, { displayName });
          }
          return userCredential;
        });
    }
    // Offline mode - simulate successful registration
    return Promise.resolve({ 
      user: { 
        uid: `user_${Date.now()}`, 
        email, 
        displayName,
        isAnonymous: false 
      } 
    });
  },

  // Sign in with email and password
  signInWithEmailAndPassword: (email, password) => {
    if (isFirebaseEnabled && auth) {
      return signInWithEmailAndPassword(auth, email, password);
    }
    // Offline mode - simulate successful sign in
    return Promise.resolve({ 
      user: { 
        uid: `user_${Date.now()}`, 
        email, 
        isAnonymous: false 
      } 
    });
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    try {
      if (isFirebaseEnabled && auth) {
        console.log('Attempting Google sign-in with Firebase...');
        const provider = new GoogleAuthProvider();
        provider.addScope('email');
        provider.addScope('profile');
        
        const result = await signInWithPopup(auth, provider);
        console.log('Google sign-in successful:', result.user.email);
        return result;
      } else {
        console.log('Firebase not enabled, using offline mode for Google sign-in');
        // Offline mode - simulate successful Google sign in
        return Promise.resolve({ 
          user: { 
            uid: `google_user_${Date.now()}`, 
            email: 'demo@example.com',
            displayName: 'Demo User',
            isAnonymous: false 
          } 
        });
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  },

  // Sign out
  signOut: () => {
    if (isFirebaseEnabled && auth) {
      return signOut(auth);
    }
    // Offline mode - simulate sign out
    return Promise.resolve();
  },

  // Send password reset email
  sendPasswordResetEmail: (email) => {
    if (isFirebaseEnabled && auth) {
      return sendPasswordResetEmail(auth, email);
    }
    // Offline mode - simulate successful email send
    return Promise.resolve();
  },

  // Link anonymous account with email/password
  linkWithEmailAndPassword: (email, password, displayName = '') => {
    if (isFirebaseEnabled && auth?.currentUser) {
      const credential = EmailAuthProvider.credential(email, password);
      return linkWithCredential(auth.currentUser, credential)
        .then(async (userCredential) => {
          if (displayName) {
            await updateProfile(userCredential.user, { displayName });
          }
          return userCredential;
        });
    }
    // Offline mode - simulate successful linking
    return Promise.resolve({ 
      user: { 
        uid: auth?.currentUser?.uid || `user_${Date.now()}`, 
        email, 
        displayName,
        isAnonymous: false 
      } 
    });
  },

  // Migrate data from anonymous user to authenticated user
  migrateAnonymousData: async (oldUserId, newUserId, appId) => {
    if (!isFirebaseEnabled || !db) {
      // console.log('Data migration skipped in offline mode');
      return;
    }

    try {
      // Get all data from anonymous user
      const [draftsSnapshot, businessPlanSnapshot, progressSnapshot] = await Promise.all([
        getDocs(collection(db, `artifacts/${appId}/users/${oldUserId}/drafts`)),
        getDoc(doc(db, `artifacts/${appId}/users/${oldUserId}/business_plan`, 'business_plan_data')),
        getDoc(doc(db, `artifacts/${appId}/users/${oldUserId}/progress`, 'progress_data'))
      ]);

      // Migrate drafts
      const batch = [];
      draftsSnapshot.forEach((docSnapshot) => {
        const newDocRef = doc(db, `artifacts/${appId}/users/${newUserId}/drafts`, docSnapshot.id);
        batch.push(setDoc(newDocRef, docSnapshot.data()));
      });

      // Migrate business plan
      if (businessPlanSnapshot.exists()) {
        const newBusinessPlanRef = doc(db, `artifacts/${appId}/users/${newUserId}/business_plan`, 'business_plan_data');
        batch.push(setDoc(newBusinessPlanRef, businessPlanSnapshot.data()));
      }

      // Migrate progress
      if (progressSnapshot.exists()) {
        const newProgressRef = doc(db, `artifacts/${appId}/users/${newUserId}/progress`, 'progress_data');
        batch.push(setDoc(newProgressRef, progressSnapshot.data()));
      }

      // Execute migration
      await Promise.all(batch);
      // console.log('Data migration completed successfully');
    } catch (error) {
      // console.error('Error migrating data:', error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: (updates) => {
    if (isFirebaseEnabled && auth?.currentUser) {
      return updateProfile(auth.currentUser, updates);
    }
    // Offline mode - simulate successful update
    return Promise.resolve();
  },
  
  // Listen to auth state changes
  onAuthStateChanged: (callback) => {
    if (isFirebaseEnabled && auth) {
      return onAuthStateChanged(auth, callback);
    }
    // Offline mode - simulate authenticated user
    setTimeout(() => callback({ uid: 'offline-user', isAnonymous: true }), 100);
    return () => {}; // Return unsubscribe function
  },
  
  // Get current user
  getCurrentUser: () => {
    if (isFirebaseEnabled && auth?.currentUser) {
      return auth.currentUser;
    }
    return { uid: 'offline-user', isAnonymous: true };
  },
  
  // Get user ID
  getUserId: () => {
    if (isFirebaseEnabled && auth?.currentUser) {
      return auth.currentUser.uid;
    }
    return 'offline-user';
  }
};

// Offline storage helpers
const offlineStorage = {
  save: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify({ ...data, updatedAt: new Date().toISOString() }));
    } catch (error) {
      // console.error('Error saving to localStorage:', error);
    }
  },
  
  get: (key) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      // console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      // console.error('Error removing from localStorage:', error);
    }
  }
};

// Database service
export const dbService = {
  // Business plan operations
  saveBusinessPlan: async (userId, appId, data) => {
    if (isFirebaseEnabled && db && userId) {
      const docRef = doc(db, `artifacts/${appId}/users/${userId}/business_plan`, 'business_plan_data');
      await setDoc(docRef, { ...data, updatedAt: new Date() });
    } else {
      // Offline mode - save to localStorage
      const key = `businessPlan_${appId}_${userId}`;
      offlineStorage.save(key, data);
    }
  },
  
  getBusinessPlan: async (userId, appId) => {
    if (isFirebaseEnabled && db && userId) {
      const docRef = doc(db, `artifacts/${appId}/users/${userId}/business_plan`, 'business_plan_data');
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } else {
      // Offline mode - get from localStorage
      const key = `businessPlan_${appId}_${userId}`;
      return offlineStorage.get(key);
    }
  },
  
  subscribeToBusinessPlan: (userId, appId, callback) => {
    if (isFirebaseEnabled && db && userId) {
      const docRef = doc(db, `artifacts/${appId}/users/${userId}/business_plan`, 'business_plan_data');
      return onSnapshot(docRef, callback);
    } else {
      // Offline mode - simulate subscription with periodic checks
      const key = `businessPlan_${appId}_${userId}`;
      let lastData = offlineStorage.get(key);
      
      const interval = setInterval(() => {
        const currentData = offlineStorage.get(key);
        if (JSON.stringify(currentData) !== JSON.stringify(lastData)) {
          lastData = currentData;
          callback({ data: () => currentData, exists: () => !!currentData });
        }
      }, 1000);
      
      // Initial callback
      setTimeout(() => callback({ data: () => lastData, exists: () => !!lastData }), 100);
      
      return () => clearInterval(interval);
    }
  },
  
  // Progress tracking operations
  saveProgressData: async (userId, appId, data) => {
    if (isFirebaseEnabled && db && userId) {
      const docRef = doc(db, `artifacts/${appId}/users/${userId}/progress`, 'progress_data');
      await setDoc(docRef, { ...data, updatedAt: new Date() });
    } else {
      // Offline mode
      const key = `progressData_${appId}_${userId}`;
      offlineStorage.save(key, data);
    }
  },
  
  getProgressData: async (userId, appId) => {
    if (isFirebaseEnabled && db && userId) {
      const docRef = doc(db, `artifacts/${appId}/users/${userId}/progress`, 'progress_data');
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } else {
      // Offline mode
      const key = `progressData_${appId}_${userId}`;
      return offlineStorage.get(key);
    }
  },
  
  subscribeToProgressData: (userId, appId, callback) => {
    if (isFirebaseEnabled && db && userId) {
      const docRef = doc(db, `artifacts/${appId}/users/${userId}/progress`, 'progress_data');
      return onSnapshot(docRef, callback);
    } else {
      // Offline mode
      const key = `progressData_${appId}_${userId}`;
      let lastData = offlineStorage.get(key);
      
      const interval = setInterval(() => {
        const currentData = offlineStorage.get(key);
        if (JSON.stringify(currentData) !== JSON.stringify(lastData)) {
          lastData = currentData;
          callback({ data: () => currentData, exists: () => !!currentData });
        }
      }, 1000);
      
      setTimeout(() => callback({ data: () => lastData, exists: () => !!lastData }), 100);
      return () => clearInterval(interval);
    }
  },
  
  // Vendor operations
  addVendor: async (userId, appId, vendorData) => {
    if (isFirebaseEnabled && db && userId) {
      const vendorsRef = collection(db, `artifacts/${appId}/users/${userId}/vendors`);
      return await addDoc(vendorsRef, { ...vendorData, createdAt: new Date() });
    } else {
      // Offline mode
      const key = `vendors_${appId}_${userId}`;
      const vendors = offlineStorage.get(key) || [];
      const newVendor = { 
        ...vendorData, 
        id: Date.now().toString(), 
        createdAt: new Date().toISOString() 
      };
      vendors.unshift(newVendor);
      offlineStorage.save(key, vendors);
      return { id: newVendor.id };
    }
  },
  
  updateVendor: async (userId, appId, vendorId, vendorData) => {
    if (isFirebaseEnabled && db && userId) {
      const vendorRef = doc(db, `artifacts/${appId}/users/${userId}/vendors`, vendorId);
      await updateDoc(vendorRef, { ...vendorData, updatedAt: new Date() });
    } else {
      // Offline mode
      const key = `vendors_${appId}_${userId}`;
      const vendors = offlineStorage.get(key) || [];
      const index = vendors.findIndex(v => v.id === vendorId);
      if (index !== -1) {
        vendors[index] = { ...vendors[index], ...vendorData, updatedAt: new Date().toISOString() };
        offlineStorage.save(key, vendors);
      }
    }
  },
  
  deleteVendor: async (userId, appId, vendorId) => {
    if (isFirebaseEnabled && db && userId) {
      const vendorRef = doc(db, `artifacts/${appId}/users/${userId}/vendors`, vendorId);
      await deleteDoc(vendorRef);
    } else {
      // Offline mode
      const key = `vendors_${appId}_${userId}`;
      const vendors = offlineStorage.get(key) || [];
      const filtered = vendors.filter(v => v.id !== vendorId);
      offlineStorage.save(key, filtered);
    }
  },
  
  subscribeToVendors: (userId, appId, callback) => {
    if (isFirebaseEnabled && db && userId) {
      const vendorsRef = collection(db, `artifacts/${appId}/users/${userId}/vendors`);
      const q = query(vendorsRef, orderBy('createdAt', 'desc'));
      return onSnapshot(q, callback);
    } else {
      // Offline mode
      const key = `vendors_${appId}_${userId}`;
      let lastData = offlineStorage.get(key) || [];
      
      const interval = setInterval(() => {
        const currentData = offlineStorage.get(key) || [];
        if (JSON.stringify(currentData) !== JSON.stringify(lastData)) {
          lastData = currentData;
          callback({ docs: currentData.map(doc => ({ id: doc.id, data: () => doc })) });
        }
      }, 1000);
      
      setTimeout(() => callback({ docs: lastData.map(doc => ({ id: doc.id, data: () => doc })) }), 100);
      return () => clearInterval(interval);
    }
  },

  // Draft operations
  saveDraft: async (userId, appId, draftData) => {
    if (isFirebaseEnabled && db && userId) {
      const draftRef = doc(db, `artifacts/${appId}/users/${userId}/drafts`, draftData.id);
      await setDoc(draftRef, { ...draftData, updatedAt: new Date() });
    } else {
      // Offline mode
      const key = `drafts_${appId}_${userId}`;
      const drafts = offlineStorage.get(key) || [];
      const index = drafts.findIndex(d => d.id === draftData.id);
      const updatedDraft = { ...draftData, updatedAt: new Date().toISOString() };
      
      if (index !== -1) {
        drafts[index] = updatedDraft;
      } else {
        drafts.push(updatedDraft);
      }
      
      // Sort by updatedAt desc
      drafts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      offlineStorage.save(key, drafts);
    }
  },

  getDraft: async (userId, appId, draftId) => {
    if (isFirebaseEnabled && db && userId) {
      const draftRef = doc(db, `artifacts/${appId}/users/${userId}/drafts`, draftId);
      const docSnap = await getDoc(draftRef);
      return docSnap.exists() ? docSnap.data() : null;
    } else {
      // Offline mode
      const key = `drafts_${appId}_${userId}`;
      const drafts = offlineStorage.get(key) || [];
      return drafts.find(d => d.id === draftId) || null;
    }
  },

  getDrafts: async (userId, appId) => {
    if (isFirebaseEnabled && db && userId) {
      try {
        const draftsRef = collection(db, `artifacts/${appId}/users/${userId}/drafts`);
        const q = query(draftsRef, orderBy('updatedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const drafts = [];
        querySnapshot.forEach((doc) => {
          drafts.push(doc.data());
        });
        
        return drafts;
      } catch (error) {
        // console.error('Error getting drafts:', error);
        return [];
      }
    } else {
      // Offline mode
      const key = `drafts_${appId}_${userId}`;
      return offlineStorage.get(key) || [];
    }
  },

  deleteDraft: async (userId, appId, draftId) => {
    if (isFirebaseEnabled && db && userId) {
      const draftRef = doc(db, `artifacts/${appId}/users/${userId}/drafts`, draftId);
      await deleteDoc(draftRef);
    } else {
      // Offline mode
      const key = `drafts_${appId}_${userId}`;
      const drafts = offlineStorage.get(key) || [];
      const filtered = drafts.filter(d => d.id !== draftId);
      offlineStorage.save(key, filtered);
    }
  },

  saveDraftsMetadata: async (userId, appId, draftsArray) => {
    if (isFirebaseEnabled && db && userId) {
      const metadataRef = doc(db, `artifacts/${appId}/users/${userId}`, 'drafts_metadata');
      await setDoc(metadataRef, { 
        drafts: draftsArray.map(draft => ({
          id: draft.id,
          name: draft.name,
          createdAt: draft.createdAt,
          updatedAt: draft.updatedAt
        })),
        lastUpdated: new Date()
      });
    } else {
      // Offline mode - metadata is handled automatically with draft operations
      // console.log('Drafts metadata saved in offline mode');
    }
  },

  subscribeToDrafts: (userId, appId, callback) => {
    if (isFirebaseEnabled && db && userId) {
      const draftsRef = collection(db, `artifacts/${appId}/users/${userId}/drafts`);
      const q = query(draftsRef, orderBy('updatedAt', 'desc'));
      return onSnapshot(q, callback);
    } else {
      // Offline mode
      const key = `drafts_${appId}_${userId}`;
      let lastData = offlineStorage.get(key) || [];
      
      const interval = setInterval(() => {
        const currentData = offlineStorage.get(key) || [];
        if (JSON.stringify(currentData) !== JSON.stringify(lastData)) {
          lastData = currentData;
          callback({ docs: currentData.map(doc => ({ id: doc.id, data: () => doc })) });
        }
      }, 1000);
      
      setTimeout(() => callback({ docs: lastData.map(doc => ({ id: doc.id, data: () => doc })) }), 100);
      return () => clearInterval(interval);
    }
  }
};

// App configuration
export const getAppId = () => {
  return typeof window !== 'undefined' && window.__app_id 
    ? window.__app_id 
    : process.env.REACT_APP_ID || 'default-app-id';
};

export const getInitialAuthToken = () => {
  return typeof window !== 'undefined' && window.__initial_auth_token 
    ? window.__initial_auth_token 
    : null;
};

// User management functions
export const getAllUsers = async () => {
  if (isFirebaseEnabled && db) {
    try {
      const appId = getAppId();
      const usersRef = collection(db, `artifacts/${appId}/users`);
      const querySnapshot = await getDocs(usersRef);
      
      const users = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        users.push({
          id: doc.id,
          ...userData
        });
      });
      
      return users;
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  } else {
    // Offline mode - get users from localStorage
    const appId = getAppId();
    const users = [];
    
    // Get all localStorage keys that match the pattern
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`drafts_${appId}_`)) {
        const userId = key.replace(`drafts_${appId}_`, '');
        const drafts = JSON.parse(localStorage.getItem(key) || '[]');
        
        if (drafts.length > 0) {
          // Get user info from the first draft
          const firstDraft = drafts[0];
          users.push({
            id: userId,
            email: firstDraft.userEmail || 'Anonymous',
            displayName: firstDraft.userDisplayName || 'Anonymous User',
            isAnonymous: !firstDraft.userEmail,
            createdAt: firstDraft.createdAt,
            drafts: drafts
          });
        }
      }
    }
    
    return users;
  }
};

export const deleteUserAccount = async (userId) => {
  if (isFirebaseEnabled && db) {
    try {
      const appId = getAppId();
      
      // Delete all drafts for this user
      const draftsRef = collection(db, `artifacts/${appId}/users/${userId}/drafts`);
      const querySnapshot = await getDocs(draftsRef);
      
      const deletePromises = [];
      querySnapshot.forEach((doc) => {
        deletePromises.push(deleteDoc(doc.ref));
      });
      
      await Promise.all(deletePromises);
      
      // Delete user metadata
      const userRef = doc(db, `artifacts/${appId}/users`, userId);
      await deleteDoc(userRef);
      
      return true;
    } catch (error) {
      console.error('Error deleting user account:', error);
      throw error;
    }
  } else {
    // Offline mode - delete from localStorage
    const appId = getAppId();
    const key = `drafts_${appId}_${userId}`;
    localStorage.removeItem(key);
    return true;
  }
};

export { auth, db }; 