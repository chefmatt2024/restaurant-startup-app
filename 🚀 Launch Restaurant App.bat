@echo off
title Boston Restaurant Business Planner
color 0A

echo.
echo ======================================================
echo     🍽️  Boston Restaurant Business Planner  🍽️
echo ======================================================
echo.
echo Starting your restaurant planning app...
echo.

REM Change to the app directory
cd /d "%~dp0"

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    echo.
    echo Please install Node.js from: https://nodejs.org
    echo.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    echo This may take a few minutes on first run...
    npm install
    if errorlevel 1 (
        echo.
        echo ❌ Failed to install dependencies
        echo.
        pause
        exit /b 1
    )
)

echo.
echo 🚀 Starting the development server...
echo.
echo ⏰ This will take 30-60 seconds to start up...
echo 🌐 Your app will automatically open in your browser
echo 📱 If it doesn't open, go to: http://localhost:3000
echo.
echo ⚠️  Keep this window open while using the app
echo 🛑 Press Ctrl+C to stop the app when you're done
echo.

REM Start the app and open browser
start "" "http://localhost:3000"
npm start

echo.
echo App has stopped. Press any key to close this window.
pause >nul 