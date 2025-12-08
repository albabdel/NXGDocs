# Vercel Deployment Script
# Run this script to deploy to Vercel

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Vercel Deployment for NXGEN Docs" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if build exists
if (-not (Test-Path "build")) {
    Write-Host "Building project first..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Build failed! Please fix errors and try again." -ForegroundColor Red
        exit 1
    }
    Write-Host "Build completed successfully!" -ForegroundColor Green
    Write-Host ""
}

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Check if logged in
Write-Host "Checking Vercel authentication..." -ForegroundColor Yellow
$whoami = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "You need to login to Vercel first." -ForegroundColor Yellow
    Write-Host "Running: vercel login" -ForegroundColor Yellow
    Write-Host ""
    vercel login
}

Write-Host ""
Write-Host "Deploying to Vercel production..." -ForegroundColor Green
Write-Host ""
Write-Host "Follow the prompts:" -ForegroundColor Cyan
Write-Host "  - Set up and deploy? Y" -ForegroundColor White
Write-Host "  - Which scope? (select your account)" -ForegroundColor White
Write-Host "  - Link to existing project? N (first time)" -ForegroundColor White
Write-Host "  - Project name: nxgen-docs" -ForegroundColor White
Write-Host "  - Directory: ./" -ForegroundColor White
Write-Host "  - Override settings? N" -ForegroundColor White
Write-Host ""

vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  Deployment Successful!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your site is now live on Vercel!" -ForegroundColor Green
    Write-Host "Check the URL above for your deployment link." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Deployment failed. Check the error messages above." -ForegroundColor Red
}
