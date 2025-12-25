# 🤝 Collaboration & Sharing Feature Guide

## Overview

The collaboration feature allows users to share their restaurant business plan projects with other users and work together in real-time. This enables team collaboration, consultant access, and multi-user project management.

## ✅ Features Implemented

### 1. **Project Sharing**
- Share any draft/project with other users by email
- Set permission levels (Viewer, Editor, Owner)
- Manage collaborators from one place

### 2. **Permission Levels**
- **Owner**: Full control (you, the creator)
  - Can share, edit, delete, and manage permissions
- **Editor**: Can view and edit
  - Can make changes to all sections
  - Cannot share or delete
- **Viewer**: Read-only access
  - Can view all sections
  - Cannot make any changes

### 3. **Invitation System**
- Send invitations via email
- Invitations appear in recipient's notification center
- Accept or decline invitations
- Automatic access after acceptance

### 4. **Collaborator Management**
- View all collaborators on a project
- Update permissions (change Viewer to Editor, etc.)
- Remove collaborators
- See invitation status (pending, accepted, declined)

## 🚀 How to Use

### Sharing a Project

1. **Open Draft Manager**
   - Click on the draft/project name in the header
   - Or click "Manage All" in the draft dropdown

2. **Click Share Button**
   - Find the Share icon (📤) next to any draft
   - Click it to open the Share Project modal

3. **Invite Collaborator**
   - Enter the collaborator's email address
   - Select permission level (Viewer or Editor)
   - Click "Send Invite"

4. **Manage Collaborators**
   - View all current collaborators
   - Change permissions using the dropdown
   - Remove collaborators with the X button

### Accepting an Invitation

1. **Check Notifications**
   - Look for the bell icon (🔔) in the header
   - Red badge shows number of pending invitations

2. **View Invitations**
   - Click the bell icon
   - See all pending invitations

3. **Accept or Decline**
   - Click "Accept" to gain access
   - Click "Decline" to reject
   - Accepted projects appear in your draft list

### Working on Shared Projects

1. **Access Shared Projects**
   - Shared projects appear in your draft list
   - They're marked with a "Shared" indicator
   - Owner's email is shown

2. **Edit Permissions**
   - Editors can make changes like normal
   - Viewers see read-only mode
   - Changes sync automatically

3. **Real-time Updates**
   - Changes by collaborators appear automatically
   - No need to refresh the page
   - See who made what changes (coming soon)

## 📊 Technical Details

### Firestore Structure

```
artifacts/{appId}/
  ├── users/{userId}/
  │   └── drafts/{draftId}
  │       └── sharedWith: [array of shares]
  └── shares/{shareId}
      ├── draftId
      ├── ownerId
      ├── ownerEmail
      ├── sharedWithEmail
      ├── permission (viewer/editor/owner)
      └── status (pending/accepted/declined)
```

### Security Rules

- Users can only share their own drafts
- Shared users can read drafts they have access to
- Editors can write to shared drafts
- Viewers can only read
- Owners have full control

### API Functions

- `shareDraft(draftId, email, permission)` - Share a draft
- `getDraftShares(draftId)` - Get all shares for a draft
- `getSharedDrafts()` - Get drafts shared with current user
- `getPendingInvitations()` - Get pending invitations
- `acceptInvitation(shareId)` - Accept an invitation
- `declineInvitation(shareId)` - Decline an invitation
- `updateSharePermission(shareId, permission)` - Update permission
- `removeShare(shareId, draftId)` - Remove collaborator
- `canEditDraft(draftId, userId)` - Check edit permission

## 🎯 Use Cases

### Use Case 1: Team Collaboration
- Restaurant owner shares with co-founders
- All have Editor access
- Work together on business plan
- Real-time updates keep everyone in sync

### Use Case 2: Consultant Access
- Share with business consultant
- Give Editor access for feedback
- Consultant can make suggestions directly
- Owner maintains control

### Use Case 3: Investor Review
- Share with potential investors
- Give Viewer access only
- Investors can review without making changes
- Professional presentation

### Use Case 4: Accountant Review
- Share financial projections
- Give Editor access to accountant
- Accountant can review and suggest changes
- Secure collaboration

## 🔒 Privacy & Security

- **Email Verification**: Only users with valid emails can be invited
- **Permission Control**: Granular permissions prevent unauthorized changes
- **Access Logging**: All shares are tracked in Firestore
- **Owner Control**: Only owners can share and manage permissions

## 🚧 Future Enhancements

- [ ] Real-time presence indicators (see who's online)
- [ ] Change tracking (see who made what changes)
- [ ] Comments and annotations
- [ ] Version history
- [ ] Bulk sharing (share with multiple users at once)
- [ ] Share via link (public/private links)
- [ ] Activity feed (see all collaboration activity)
- [ ] Notification emails (email when shared/invited)

## 📝 Notes

- **Email Matching**: Invitations are matched by email address
- **Account Required**: Collaborators must have an account (can sign up)
- **Auto-Sync**: Changes sync automatically via Firestore
- **Offline Support**: Basic offline support (changes sync when online)

---

**Status**: ✅ Fully Implemented
**Last Updated**: 2024-01-21

