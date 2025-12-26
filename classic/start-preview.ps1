# Start Storyblok Live Preview Server
# This script starts both the Docusaurus dev server and HTTPS proxy

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Storyblok Live Preview" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if certificates exist
if (-not (Test-Path "localhost.pem") -or -not (Test-Path "localhost-key.pem")) {
    Write-Host "❌ SSL certificates not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please run setup first:" -ForegroundColor Yellow
    Write-Host "  .\setup-https.ps1" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "✓ SSL certificates found" -ForegroundColor Green
Write-Host ""

# Start Docusaurus dev server in background
Write-Host "Starting Docusaurus dev server on port 3000..." -ForegroundColor Cyan
$docusaurus = Start-Process -FilePath "npm" -ArgumentList "start" -PassThru -NoNewWindow

# Wait a bit for Docusaurus to start
Start-Sleep -Seconds 3

# Start HTTPS proxy
Write-Host "Starting HTTPS proxy on port 3010..." -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✓ Preview Server Running!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Docusaurus:  http://localhost:3000" -ForegroundColor White
Write-Host "HTTPS Proxy: https://localhost:3010" -ForegroundColor White
Write-Host ""
Write-Host "Preview URL for Storyblok:" -ForegroundColor Cyan
Write-Host "https://localhost:3010/storyblok-preview?_storyblok={STORY_ID}" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor White
Write-Host ""

# Run the proxy (this will block until Ctrl+C)
try {
    local-ssl-proxy --source 3010 --target 3000 --cert localhost.pem --key localhost-key.pem
} finally {
    # Stop Docusaurus when proxy stops
    Write-Host ""
    Write-Host "Stopping Docusaurus..." -ForegroundColor Cyan
    Stop-Process -Id $docusaurus.Id -Force -ErrorAction SilentlyContinue
    Write-Host "✓ Servers stopped" -ForegroundColor Green
}
