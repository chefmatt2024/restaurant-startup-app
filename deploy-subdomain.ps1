# PowerShell script to deploy to app.iterumfoods.xyz subdomain

Write-Host "Deploying Restaurant Planning App to app.iterumfoods.xyz" -ForegroundColor Green
Write-Host ""

Write-Host "Building the application..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Deploying to Firebase subdomain..." -ForegroundColor Yellow
firebase deploy --only hosting --project app-iterumfoods
if ($LASTEXITCODE -ne 0) {
    Write-Host "Deployment failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Deployment successful!" -ForegroundColor Green
Write-Host "Your app is now available at: https://app.iterumfoods.xyz" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Configure DNS: Add CNAME record for app.iterumfoods.xyz" -ForegroundColor White
Write-Host "2. Update your main site: Add link to app.iterumfoods.xyz" -ForegroundColor White
Write-Host "3. Test the integration" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"
