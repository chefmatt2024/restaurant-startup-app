# Restaurant Startup App Launcher (PowerShell)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Restaurant Startup App Launcher" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if npm is available
try {
    $npmVersion = npm --version
    Write-Host "✓ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ ERROR: npm is not available" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Firebase CLI is installed
try {
    $firebaseVersion = firebase --version
    Write-Host "✓ Firebase CLI found: $firebaseVersion" -ForegroundColor Green
} catch {
    Write-Host "Firebase CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g firebase-tools
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ ERROR: Failed to install Firebase CLI" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host ""
Write-Host "[1/5] Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ ERROR: Failed to install dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[2/5] Building the application..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ ERROR: Build failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[3/5] Checking Firebase authentication..." -ForegroundColor Yellow
firebase login --no-localhost
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ ERROR: Firebase authentication failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[4/5] Deploying to Firebase Hosting..." -ForegroundColor Yellow
firebase deploy --only hosting
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ ERROR: Deployment failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[5/5] Getting deployment URL..." -ForegroundColor Yellow
firebase hosting:channel:open live

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "    Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your app has been successfully deployed to Firebase Hosting." -ForegroundColor White
Write-Host "The app should open in your default browser." -ForegroundColor White
Write-Host ""
Write-Host "If you need to make changes:" -ForegroundColor Cyan
Write-Host "1. Edit your code" -ForegroundColor White
Write-Host "2. Run: npm run build" -ForegroundColor White
Write-Host "3. Run: firebase deploy --only hosting" -ForegroundColor White
Write-Host ""
Write-Host "For development with live reload:" -ForegroundColor Cyan
Write-Host "Run: npm start" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"
