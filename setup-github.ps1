# GitHub Setup Script for Boston Restaurant Business Planner
# This script will set up your repository on GitHub

Write-Host "🍽️ Boston Restaurant Business Planner - GitHub Setup" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Check if Git is installed
Write-Host "`n1. Checking Git installation..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "✅ Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Red
    Read-Host "Press Enter after installing Git to continue"
    exit 1
}

# Get user information
Write-Host "`n2. Setting up Git configuration..." -ForegroundColor Yellow
$userName = Read-Host "Enter your full name (for Git commits)"
$userEmail = Read-Host "Enter your email address (for Git commits)"
$githubUsername = Read-Host "Enter your GitHub username"

# Configure Git
git config --global user.name "$userName"
git config --global user.email "$userEmail"
Write-Host "✅ Git configured successfully" -ForegroundColor Green

# Initialize repository
Write-Host "`n3. Initializing Git repository..." -ForegroundColor Yellow
if (Test-Path ".git") {
    Write-Host "⚠️ Git repository already exists" -ForegroundColor Yellow
} else {
    git init
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
}

# Add all files
Write-Host "`n4. Adding files to repository..." -ForegroundColor Yellow
git add .
Write-Host "✅ Files added to staging area" -ForegroundColor Green

# Create initial commit
Write-Host "`n5. Creating initial commit..." -ForegroundColor Yellow
git commit -m "🎉 Initial commit - Boston Restaurant Business Planner

Features included:
- Complete React application with modern architecture
- Boston-specific market analysis and financial projections
- Government API integration framework
- Timeline management and project tracking
- Advanced business analytics dashboard
- Vendor management system
- Draft comparison and management
- Mobile-responsive design
- GitHub Pages deployment ready"

Write-Host "✅ Initial commit created" -ForegroundColor Green

# Set main branch
Write-Host "`n6. Setting up main branch..." -ForegroundColor Yellow
git branch -M main
Write-Host "✅ Main branch configured" -ForegroundColor Green

# Instructions for GitHub
Write-Host "`n7. Next Steps:" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
Write-Host "1. Go to GitHub.com and create a new repository:" -ForegroundColor White
Write-Host "   Repository name: boston-restaurant-business-planner" -ForegroundColor Gray
Write-Host "   Description: Professional business planning platform for Boston restaurants" -ForegroundColor Gray
Write-Host "   ✅ Public repository" -ForegroundColor Gray
Write-Host "   ❌ DO NOT initialize with README (we already have one)" -ForegroundColor Gray

Write-Host "`n2. After creating the repository, run:" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/$githubUsername/boston-restaurant-business-planner.git" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray

Write-Host "`n3. Enable GitHub Pages:" -ForegroundColor White
Write-Host "   - Go to Settings > Pages" -ForegroundColor Gray
Write-Host "   - Source: Deploy from a branch" -ForegroundColor Gray
Write-Host "   - Branch: gh-pages (will be created automatically)" -ForegroundColor Gray

Write-Host "`n4. Deploy your app:" -ForegroundColor White
Write-Host "   npm run deploy" -ForegroundColor Gray

Write-Host "`n🎉 Your app will be live at:" -ForegroundColor Green
Write-Host "https://$githubUsername.github.io/boston-restaurant-business-planner/" -ForegroundColor Blue

Write-Host "`n📋 Repository URL:" -ForegroundColor Green
Write-Host "https://github.com/$githubUsername/boston-restaurant-business-planner" -ForegroundColor Blue

Write-Host "`n✨ Setup complete! Follow the next steps above." -ForegroundColor Green
Read-Host "Press Enter to exit" 