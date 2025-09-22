@echo off
echo ========================================
echo    Restaurant Startup App Launcher
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not available
    pause
    exit /b 1
)

REM Check if Firebase CLI is installed
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Firebase CLI not found. Installing...
    npm install -g firebase-tools
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install Firebase CLI
        pause
        exit /b 1
    )
)

echo.
echo [1/5] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/5] Building the application...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo [3/5] Checking Firebase authentication...
firebase login --no-localhost
if %errorlevel% neq 0 (
    echo ERROR: Firebase authentication failed
    pause
    exit /b 1
)

echo.
echo [4/5] Deploying to Firebase Hosting...
firebase deploy --only hosting
if %errorlevel% neq 0 (
    echo ERROR: Deployment failed
    pause
    exit /b 1
)

echo.
echo [5/5] Getting deployment URL...
firebase hosting:channel:open live

echo.
echo ========================================
echo    Deployment Complete!
echo ========================================
echo.
echo Your app has been successfully deployed to Firebase Hosting.
echo The app should open in your default browser.
echo.
echo If you need to make changes:
echo 1. Edit your code
echo 2. Run: npm run build
echo 3. Run: firebase deploy --only hosting
echo.
echo For development with live reload:
echo Run: npm start
echo.
pause
