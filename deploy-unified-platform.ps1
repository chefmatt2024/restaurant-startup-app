# PowerShell script to deploy the unified Iterum Foods platform

Write-Host "🚀 Deploying Iterum Foods Unified Platform..." -ForegroundColor Green
Write-Host ""

Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "🔨 Building the app..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "🔥 Deploying to Firebase..." -ForegroundColor Yellow
firebase deploy --only hosting
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Firebase deployment failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "📝 Committing changes to GitHub..." -ForegroundColor Yellow
git add .
git commit -m "Deploy unified platform with all integrated apps and subscription system"
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ GitHub push failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Your unified platform is now live at:" -ForegroundColor Cyan
Write-Host "   https://iterumfoods.xyz" -ForegroundColor White
Write-Host "   https://restaurant-startup-app.web.app" -ForegroundColor White
Write-Host ""
Write-Host "🎉 All your apps are now integrated into one unified platform!" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to exit"
