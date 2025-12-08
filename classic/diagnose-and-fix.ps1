# Comprehensive diagnostic and fix script for Docusaurus @generated modules issue

Write-Host "=== Docusaurus Diagnostic and Fix Script ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Node.js version
Write-Host "Step 1: Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node --version
Write-Host "  Node.js: $nodeVersion" -ForegroundColor White
$majorVersion = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
if ($majorVersion -ge 23) {
    Write-Host "  ⚠ WARNING: Node.js $majorVersion may be incompatible with Docusaurus 3.8.1" -ForegroundColor Red
    Write-Host "  Recommendation: Use Node.js 18 or 20 LTS" -ForegroundColor Yellow
}

# Step 2: Stop all Node processes
Write-Host "`nStep 2: Stopping Node processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Step 3: Clear cache
Write-Host "`nStep 3: Clearing Docusaurus cache..." -ForegroundColor Yellow
if (Test-Path .docusaurus) {
    Remove-Item -Recurse -Force .docusaurus
    Write-Host "  ✓ Removed .docusaurus" -ForegroundColor Green
}
if (Test-Path .cache-loader) {
    Remove-Item -Recurse -Force .cache-loader
}
if (Test-Path build) {
    Remove-Item -Recurse -Force build
}
npx docusaurus clear 2>&1 | Out-Null
Write-Host "  ✓ Cache cleared" -ForegroundColor Green

# Step 4: Verify dependencies
Write-Host "`nStep 4: Checking dependencies..." -ForegroundColor Yellow
if (-not (Test-Path node_modules\@docusaurus\core)) {
    Write-Host "  ✗ Dependencies missing! Installing..." -ForegroundColor Red
    npm install
} else {
    Write-Host "  ✓ Dependencies found" -ForegroundColor Green
}

# Step 5: Validate configuration
Write-Host "`nStep 5: Validating configuration..." -ForegroundColor Yellow
$configExists = Test-Path docusaurus.config.ts
$sidebarsExists = Test-Path sidebars.ts
Write-Host "  Config: $(if($configExists){'✓'}else{'✗'})" -ForegroundColor $(if($configExists){'Green'}else{'Red'})
Write-Host "  Sidebars: $(if($sidebarsExists){'✓'}else{'✗'})" -ForegroundColor $(if($sidebarsExists){'Green'}else{'Red'})

# Step 6: Try to generate .docusaurus with build
Write-Host "`nStep 6: Attempting to generate .docusaurus directory..." -ForegroundColor Yellow
Write-Host "  Running: docusaurus build --no-minify" -ForegroundColor Gray
Write-Host "  This may take 1-2 minutes..." -ForegroundColor Gray

$buildStart = Get-Date
$buildOutput = npx docusaurus build --no-minify --out-dir build-test 2>&1
$buildDuration = (Get-Date) - $buildStart

Write-Host "  Build completed in $([math]::Round($buildDuration.TotalSeconds, 2)) seconds" -ForegroundColor $(if($buildDuration.TotalSeconds -lt 60){'Green'}else{'Yellow'})

# Step 7: Check results
Write-Host "`nStep 7: Checking results..." -ForegroundColor Yellow
if (Test-Path .docusaurus) {
    Write-Host "  ✓ SUCCESS! .docusaurus directory created!" -ForegroundColor Green
    $files = Get-ChildItem .docusaurus -Recurse -File
    Write-Host "  ✓ Generated $($files.Count) files" -ForegroundColor Green
    
    # Check for critical files
    $criticalFiles = @('client-modules', 'routes', 'docusaurus.config', 'globalData', 'i18n')
    $foundFiles = @()
    foreach ($file in $criticalFiles) {
        $found = Get-ChildItem .docusaurus -Recurse -Filter "*$file*" | Select-Object -First 1
        if ($found) { $foundFiles += $file }
    }
    
    Write-Host "  Critical files found: $($foundFiles.Count)/$($criticalFiles.Count)" -ForegroundColor $(if($foundFiles.Count -eq $criticalFiles.Count){'Green'}else{'Yellow'})
    if ($foundFiles.Count -lt $criticalFiles.Count) {
        $missing = $criticalFiles | Where-Object { $_ -notin $foundFiles }
        Write-Host "  Missing: $($missing -join ', ')" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ✗ FAILED: .docusaurus directory not created" -ForegroundColor Red
    Write-Host "`n  Analyzing build output for errors..." -ForegroundColor Yellow
    
    $errors = $buildOutput | Select-String -Pattern "ERROR|Error|error|Failed|failed|Cannot" | Select-Object -First 10
    if ($errors) {
        Write-Host "  Found errors:" -ForegroundColor Red
        $errors | ForEach-Object { Write-Host "    $_" -ForegroundColor Red }
    } else {
        Write-Host "  No obvious errors found in output" -ForegroundColor Yellow
        Write-Host "  The build may have completed but .docusaurus was not created" -ForegroundColor Yellow
        Write-Host "  This could indicate a Docusaurus initialization issue" -ForegroundColor Yellow
    }
}

# Step 8: Cleanup
Write-Host "`nStep 8: Cleaning up..." -ForegroundColor Yellow
if (Test-Path build-test) {
    Remove-Item -Recurse -Force build-test -ErrorAction SilentlyContinue
    Write-Host "  ✓ Removed test build" -ForegroundColor Green
}

# Final status
Write-Host "`n=== Diagnostic Complete ===" -ForegroundColor Cyan
if (Test-Path .docusaurus) {
    Write-Host "✓ SUCCESS! .docusaurus directory exists" -ForegroundColor Green
    Write-Host "`nYou can now start the dev server with: npm start" -ForegroundColor Cyan
} else {
    Write-Host "✗ ISSUE: .docusaurus directory was not created" -ForegroundColor Red
    Write-Host "`nPossible causes:" -ForegroundColor Yellow
    Write-Host "  1. Node.js version incompatibility (try Node 18 or 20 LTS)" -ForegroundColor White
    Write-Host "  2. Configuration error preventing initialization" -ForegroundColor White
    Write-Host "  3. Plugin or sidebar file errors" -ForegroundColor White
    Write-Host "  4. Missing dependencies" -ForegroundColor White
    Write-Host "`nCheck the errors above for more details." -ForegroundColor Yellow
}





