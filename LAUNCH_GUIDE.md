# 🚀 Restaurant Startup App - Launch Guide

## Quick Start

### For Development (Local Testing)
```bash
# Option 1: Use the launcher script
./launch-dev.bat

# Option 2: Manual commands
npm install
npm start
```

### For Production (Firebase Deployment)
```bash
# Option 1: Use the launcher script
./launch-firebase.bat

# Option 2: PowerShell (recommended)
./launch-firebase.ps1

# Option 3: Manual commands
npm install
npm run build
firebase login
firebase deploy --only hosting
```

## Prerequisites

### Required Software
1. **Node.js** (v14 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **Git** (for version control)
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

3. **Firebase CLI** (for deployment)
   - Install with: `npm install -g firebase-tools`
   - Verify installation: `firebase --version`

### Required Accounts
1. **Firebase Account**
   - Sign up at: https://firebase.google.com/
   - Create a new project: "restaurant-startup-app"

2. **GitHub Account** (optional, for version control)
   - Sign up at: https://github.com/

## Launch Scripts Explained

### `launch-dev.bat`
- **Purpose**: Start the development server
- **What it does**:
  - Installs dependencies
  - Starts the React development server
  - Opens the app at http://localhost:3000
  - Enables hot reloading for development

### `launch-firebase.bat` / `launch-firebase.ps1`
- **Purpose**: Deploy the app to Firebase Hosting
- **What it does**:
  1. Checks for required software
  2. Installs dependencies
  3. Builds the production version
  4. Authenticates with Firebase
  5. Deploys to Firebase Hosting
  6. Opens the live app in your browser

## Manual Deployment Steps

If the launcher scripts don't work, follow these manual steps:

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Application
```bash
npm run build
```

### 3. Authenticate with Firebase
```bash
firebase login
```

### 4. Deploy to Firebase
```bash
firebase deploy --only hosting
```

### 5. View Your App
```bash
firebase hosting:channel:open live
```

## Troubleshooting

### Common Issues

#### "Node.js is not installed"
- Download and install Node.js from https://nodejs.org/
- Restart your command prompt/terminal
- Verify with: `node --version`

#### "Firebase CLI not found"
- Install with: `npm install -g firebase-tools`
- If permission issues, try: `npm install -g firebase-tools --unsafe-perm`

#### "Build failed"
- Check for syntax errors in your code
- Ensure all dependencies are installed: `npm install`
- Try clearing the build cache: `npm run build -- --no-cache`

#### "Deployment failed"
- Ensure you're logged into Firebase: `firebase login`
- Check your Firebase project configuration
- Verify the project exists in Firebase Console

#### "Authentication Error"
- Re-authenticate: `firebase login --reauth`
- Check your Firebase project permissions

### Getting Help

1. **Check the console output** for specific error messages
2. **Verify all prerequisites** are installed correctly
3. **Check Firebase Console** for project status
4. **Review the logs** in Firebase Hosting dashboard

## Development Workflow

### Making Changes
1. Edit your code in the `src/` directory
2. The development server will automatically reload
3. Test your changes at http://localhost:3000

### Deploying Changes
1. Make your changes
2. Test locally with `npm start`
3. Build and deploy with `./launch-firebase.bat`
4. Verify the live app works correctly

### Version Control
```bash
# Commit your changes
git add .
git commit -m "Your commit message"
git push origin main
```

## App Features

### Current Features
- ✅ Modern, responsive UI with better contrast
- ✅ User authentication (Email, Google, Anonymous)
- ✅ Project status tracking and progress monitoring
- ✅ Comprehensive business plan sections
- ✅ Mobile-optimized interface
- ✅ Real-time data saving to Firebase
- ✅ Multiple draft management

### Dashboard Overview
- Project progress tracking
- Next priority tasks
- Section completion status
- Quick action buttons
- Modern gradient design

## Support

If you encounter any issues:
1. Check this guide first
2. Review the console output for errors
3. Ensure all prerequisites are installed
4. Try the manual deployment steps

---

**Happy coding! 🎉**
