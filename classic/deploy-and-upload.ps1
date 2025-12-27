# AUTOMATED DEPLOYMENT AND IMAGE UPLOAD
# This script will deploy to Netlify and upload all images to Hygraph

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  NXGEN DOCS - AUTOMATED DEPLOYMENT & IMAGE UPLOAD" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Deploy to Netlify
Write-Host "Step 1: Deploying to Netlify..." -ForegroundColor Yellow
Write-Host "You'll need to select your team when prompted." -ForegroundColor Yellow
Write-Host ""

$deployOutput = netlify deploy --prod --dir=build 2>&1 | Tee-Object -Variable deployLog

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Deployment failed. Please run manually:" -ForegroundColor Red
    Write-Host "  netlify deploy --prod --dir=build" -ForegroundColor Yellow
    exit 1
}

# Step 2: Extract the URL
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Step 2: Extracting site URL..." -ForegroundColor Yellow
Write-Host ""

$siteUrl = netlify status 2>&1 | Select-String "Site URL:" | ForEach-Object { $_.ToString().Split(":")[1].Trim() }

if (-not $siteUrl -or $siteUrl -eq "undefined") {
    Write-Host "Could not extract site URL automatically." -ForegroundColor Red
    Write-Host ""
    $siteUrl = Read-Host "Please enter your Netlify site URL (e.g., https://nxgen-docs-12345.netlify.app)"
}

Write-Host "Site URL: $siteUrl" -ForegroundColor Green
Write-Host ""

# Step 3: Run bulk image upload
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Step 3: Uploading 1,073 images to Hygraph..." -ForegroundColor Yellow
Write-Host "This will take approximately 36 minutes." -ForegroundColor Yellow
Write-Host ""
Write-Host "Starting in 5 seconds... (Press Ctrl+C to cancel)" -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "🚀 Starting bulk upload..." -ForegroundColor Green
Write-Host ""

npm run upload:bulk $siteUrl

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "  ✅ COMPLETE!" -ForegroundColor Green
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Results:" -ForegroundColor Green
    Write-Host "  📁 Site deployed to: $siteUrl" -ForegroundColor White
    Write-Host "  📊 Check image-mapping.json for upload details" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "Image upload encountered errors." -ForegroundColor Red
    Write-Host "Check image-mapping.json for details." -ForegroundColor Yellow
    Write-Host ""
}
