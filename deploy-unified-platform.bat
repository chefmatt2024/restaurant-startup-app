@echo off
echo 🚀 Deploying Iterum Foods Unified Platform...
echo.

echo 📦 Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo 🔨 Building the app...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo.
echo 🔥 Deploying to Firebase...
call firebase deploy --only hosting
if %errorlevel% neq 0 (
    echo ❌ Firebase deployment failed!
    pause
    exit /b 1
)

echo.
echo 📝 Committing changes to GitHub...
git add .
git commit -m "Deploy unified platform with all integrated apps and subscription system"
git push origin main
if %errorlevel% neq 0 (
    echo ❌ GitHub push failed!
    pause
    exit /b 1
)

echo.
echo ✅ Deployment complete!
echo.
echo 🌐 Your unified platform is now live at:
echo    https://iterumfoods.xyz
echo    https://restaurant-startup-app.web.app
echo.
echo 🎉 All your apps are now integrated into one unified platform!
echo.
pause
