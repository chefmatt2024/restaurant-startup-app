# Boston Restaurant Business Planner - PowerShell Launcher

Write-Host ""
Write-Host "======================================================" -ForegroundColor Green
Write-Host "    🍽️  Boston Restaurant Business Planner  🍽️" -ForegroundColor Green  
Write-Host "======================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Starting your restaurant planning app..." -ForegroundColor Cyan
Write-Host ""

# Change to script directory
Set-Location $PSScriptRoot

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js from: https://nodejs.org" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    Write-Host "This may take a few minutes on first run..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        Write-Host ""
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host ""
Write-Host "🚀 Starting the development server..." -ForegroundColor Cyan
Write-Host ""
Write-Host "⏰ This will take 30-60 seconds to start up..." -ForegroundColor Yellow
Write-Host "🌐 Your app will automatically open in your browser" -ForegroundColor Green
Write-Host "📱 If it doesn't open, go to: http://localhost:3000" -ForegroundColor Blue
Write-Host ""
Write-Host "⚠️  Keep this window open while using the app" -ForegroundColor Yellow
Write-Host "🛑 Press Ctrl+C to stop the app when you're done" -ForegroundColor Red
Write-Host ""

# Start the app and open browser
Start-Process "http://localhost:3000"
npm start

Write-Host ""
Write-Host "App has stopped. Press any key to close this window." -ForegroundColor Yellow
Read-Host 