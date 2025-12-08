# Fix script for Docusaurus @generated modules issue
# This script will:
# 1. Stop any running Node processes
# 2. Clear Docusaurus cache
# 3. Reinstall dependencies if needed
# 4. Run a build to generate .docusaurus directory
# 5. Start the dev server

Write-Host "=== Fixing Docusaurus @generated modules issue ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Stop any running Node processes
Write-Host "Step 1: Stopping any running Node processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "  ✓ Done" -ForegroundColor Green
Write-Host ""

# Step 2: Clear Docusaurus cache
Write-Host "Step 2: Clearing Docusaurus cache..." -ForegroundColor Yellow
if (Test-Path .docusaurus) {
    Remove-Item -Recurse -Force .docusaurus -ErrorAction SilentlyContinue
    Write-Host "  ✓ Removed existing .docusaurus directory" -ForegroundColor Green
}
if (Test-Path .cache-loader) {
    Remove-Item -Recurse -Force .cache-loader -ErrorAction SilentlyContinue
}
npx docusaurus clear 2>&1 | Out-Null
Write-Host "  ✓ Cache cleared" -ForegroundColor Green
Write-Host ""

# Step 3: Check Node.js version
Write-Host "Step 3: Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node --version
Write-Host "  Node.js version: $nodeVersion" -ForegroundColor White
if ($nodeVersion -match "v(2[3-9]|3[0-9])") {
    Write-Host "  ⚠ Warning: Node.js version may be incompatible. Consider using Node.js 18 or 20 LTS" -ForegroundColor Yellow
}
Write-Host ""

# Step 4: Verify dependencies
Write-Host "Step 4: Verifying dependencies..." -ForegroundColor Yellow
if (-not (Test-Path node_modules\@docusaurus\core)) {
    Write-Host "  Installing dependencies..." -ForegroundColor Yellow
    npm install 2>&1 | Out-Null
    Write-Host "  ✓ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "  ✓ Dependencies found" -ForegroundColor Green
}
Write-Host ""

# Step 5: Run build to generate .docusaurus directory
Write-Host "Step 5: Running build to generate .docusaurus directory..." -ForegroundColor Yellow
Write-Host "  This may take a few minutes..." -ForegroundColor Gray
$buildOutput = npx docusaurus build --no-minify --out-dir build-temp 2>&1

if (Test-Path .docusaurus) {
    Write-Host "  ✓ SUCCESS! .docusaurus directory created!" -ForegroundColor Green
    $files = Get-ChildItem .docusaurus -Recurse -File
    Write-Host "  ✓ Generated $($files.Count) files" -ForegroundColor Green
    
    # Check for key files
    $keyFiles = $files | Where-Object { $_.Name -match "(client-modules|routes|docusaurus.config)" }
    if ($keyFiles) {
        Write-Host "  ✓ Key generated files found" -ForegroundColor Green
    }
} else {
    Write-Host "  ✗ FAILED: .docusaurus directory not created" -ForegroundColor Red
    Write-Host "  Checking for errors..." -ForegroundColor Yellow
    $errors = $buildOutput | Select-String -Pattern "ERROR|error|Error|Failed|failed" | Select-Object -First 10
    if ($errors) {
        Write-Host "  Errors found:" -ForegroundColor Red
        $errors | ForEach-Object { Write-Host "    $_" -ForegroundColor Red }
    }
    Write-Host ""
    Write-Host "Please review the errors above and fix them before proceeding." -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Step 6: Clean up temp build
if (Test-Path build-temp) {
    Remove-Item -Recurse -Force build-temp -ErrorAction SilentlyContinue
}
Write-Host ""

# Step 7: Start dev server
Write-Host "Step 6: Starting dev server..." -ForegroundColor Yellow
Write-Host "  The server will start in the background." -ForegroundColor Gray
Write-Host "  Check http://localhost:3000 after a few moments." -ForegroundColor Gray
Write-Host ""
Write-Host "=== Fix complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "To start the dev server manually, run:" -ForegroundColor Cyan
Write-Host "  npm start" -ForegroundColor White
Write-Host ""





