@echo off
echo Deploying Restaurant Planning App to app.iterumfoods.xyz
echo.

echo Building the application...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo Deploying to Firebase subdomain...
firebase deploy --only hosting --project app-iterumfoods
if %errorlevel% neq 0 (
    echo Deployment failed!
    pause
    exit /b 1
)

echo.
echo Deployment successful!
echo Your app is now available at: https://app.iterumfoods.xyz
echo.
echo Next steps:
echo 1. Configure DNS: Add CNAME record for app.iterumfoods.xyz
echo 2. Update your main site: Add link to app.iterumfoods.xyz
echo 3. Test the integration
echo.
pause
