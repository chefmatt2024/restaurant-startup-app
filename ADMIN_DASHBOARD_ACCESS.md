# 🔐 Admin Dashboard Access Guide

## 📍 Where is the Admin Dashboard?

The Admin Dashboard is accessible through the main application navigation:

1. **Location in App:**
   - Navigate to the **Dashboard** page
   - Click on the **"Admin Dashboard"** tab in the tab navigation
   - Tab icon: ⚙️ Settings icon
   - Tab label: "Admin Dashboard"
   - Description: "User & lead management"

2. **Direct Access:**
   - The admin dashboard is available as a tab option in the main navigation
   - It's protected by `AdminAccessControl` component
   - Only authorized users can view it

## 👥 Who Has Access?

### **Authorized Admin Users**

Currently, the following users have full admin access:

#### **1. Specific Admin Emails:**
- `matt@iterumfoods.com`
- `hello@iterumfoods.xyz`
- `admin@iterumfoods.xyz`

#### **2. Domain-Based Access:**
- **Any email ending with `@iterumfoods.com`** automatically gets admin access
- This allows all team members with company email addresses to access admin features

### **Access Control Logic:**

The system checks admin access in `src/components/admin/AdminAccessControl.js`:

```javascript
const checkUserAdminStatus = async (email) => {
  const adminEmails = [
    'matt@iterumfoods.com',
    'hello@iterumfoods.xyz',
    'admin@iterumfoods.xyz'
  ];

  // Any @iterumfoods.com email gets admin access
  const isIterumEmail = email && email.endsWith('@iterumfoods.com');
  const isAuthorizedEmail = adminEmails.includes(email.toLowerCase());
  
  return isAuthorizedEmail || isIterumEmail;
};
```

## 🛡️ Security Features

### **Authentication Required:**
- Users must be logged in to access admin functions
- Anonymous users are automatically denied access
- Access is checked in real-time when accessing the dashboard

### **Access Denied Page:**
- If a user doesn't have access, they see a professional "Access Denied" page
- Shows current user email and access level
- Provides clear messaging about why access was denied

### **Access Levels:**
- **Admin**: Full access to all admin functions
- **Manager**: Limited access (coming soon)
- **Viewer**: Read-only access (coming soon)
- **None**: No access to admin dashboard

## 📊 Admin Dashboard Features

Once accessed, the admin dashboard includes:

1. **User Management** - View and manage all users (now connected to Firebase)
2. **Lead Management** - Track and manage leads
3. **Analytics Dashboard** - View system analytics
4. **Email Campaigns** - Manage email marketing
5. **Settings** - System configuration (coming soon)
6. **Security** - Security settings (coming soon)
7. **Database** - Database management (coming soon)
8. **Notifications** - Notification management (coming soon)
9. **Support** - Support tools (coming soon)

## 🔧 How to Grant Admin Access

### **Method 1: Add to Authorized List**

1. Open `src/components/admin/AdminAccessControl.js`
2. Find the `adminEmails` array (around line 57)
3. Add the new email address:

```javascript
const adminEmails = [
  'matt@iterumfoods.com',
  'hello@iterumfoods.xyz',
  'admin@iterumfoods.xyz',
  'newadmin@example.com'  // Add new admin here
];
```

### **Method 2: Domain-Based Access**
- Any email ending with `@iterumfoods.com` automatically gets admin access
- No code changes needed for team members with company emails

### **Method 3: Database-Based Access (Future)**
- Store admin permissions in Firebase Firestore
- More flexible and scalable approach
- Allows for role-based permissions
- Can be managed through the admin dashboard itself

## 🚨 Current Status

- ✅ Admin access control is **active and working**
- ✅ User Management is **connected to Firebase** (shows real users)
- ✅ Access is **email-based** (hardcoded list + domain check)
- ⚠️ Access control is **client-side only** (for now)
- 🔄 Database-based permissions **coming soon**

## 📝 Notes

- The admin dashboard is visible in the tab navigation to all users, but access is controlled
- Non-admin users will see an "Access Denied" page if they try to access it
- Admin access is checked every time the dashboard is loaded
- The access control component wraps the entire AdminDashboard component

## 🔍 Testing Admin Access

To test if you have admin access:

1. Log in with an authorized email
2. Navigate to Dashboard
3. Click on "Admin Dashboard" tab
4. If you have access, you'll see the admin dashboard
5. If you don't have access, you'll see the "Access Denied" page

## 📞 Need Help?

If you need to grant admin access to a new user:
1. Add their email to the `adminEmails` array in `AdminAccessControl.js`
2. Or ensure they use an `@iterumfoods.com` email address
3. Deploy the changes to Firebase

