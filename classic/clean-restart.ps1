# Clean restart script for Docusaurus
Write-Host "Cleaning Docusaurus cache and build files..." -ForegroundColor Yellow

# Remove cache directories
if (Test-Path .docusaurus) {
    Remove-Item -Recurse -Force .docusaurus
    Write-Host "✓ Removed .docusaurus cache" -ForegroundColor Green
}

if (Test-Path build) {
    Remove-Item -Recurse -Force build
    Write-Host "✓ Removed build directory" -ForegroundColor Green
}

if (Test-Path node_modules\.cache) {
    Remove-Item -Recurse -Force node_modules\.cache
    Write-Host "✓ Removed node_modules cache" -ForegroundColor Green
}

Write-Host "`nCleanup complete! Now run: npm run start" -ForegroundColor Cyan

















