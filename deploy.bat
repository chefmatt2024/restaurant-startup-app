@echo off
echo ========================================
echo   Restaurant Business Planner Deploy
echo ========================================
echo.

echo [1/3] Building application...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo.
echo [2/3] Deploying to Firebase Hosting...
call firebase deploy --only hosting:app
if %errorlevel% neq 0 (
    echo ❌ Deployment failed!
    pause
    exit /b 1
)

echo.
echo [3/3] ✅ Deployment complete!
echo.
echo 🌐 Your app is live at: https://restaurant-startup-app.web.app
echo.
pause

