# Restaurant Business Planner - Deployment Script

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Restaurant Business Planner Deploy" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "[1/3] Building application..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[2/3] Deploying to Firebase Hosting..." -ForegroundColor Yellow
firebase deploy --only hosting:app
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[3/3] ✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Your app is live at: https://restaurant-startup-app.web.app" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to exit"

