# Storyblok HTTPS Preview Setup Script for Windows
# This script sets up SSL certificates for local HTTPS development

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Storyblok HTTPS Preview Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if mkcert is installed
$mkcertInstalled = Get-Command mkcert -ErrorAction SilentlyContinue

if (-not $mkcertInstalled) {
    Write-Host "⚠️  mkcert is not installed." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please install mkcert using one of these methods:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 1 - Using Chocolatey (recommended):" -ForegroundColor Green
    Write-Host "  choco install mkcert" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 2 - Using Scoop:" -ForegroundColor Green
    Write-Host "  scoop bucket add extras"
    Write-Host "  scoop install mkcert" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 3 - Manual download:" -ForegroundColor Green
    Write-Host "  Download from: https://github.com/FiloSottile/mkcert/releases" -ForegroundColor White
    Write-Host "  Rename to mkcert.exe and add to PATH" -ForegroundColor White
    Write-Host ""
    Write-Host "After installing mkcert, run this script again." -ForegroundColor Cyan
    exit 1
}

Write-Host "✓ mkcert is installed" -ForegroundColor Green
Write-Host ""

# Install local CA
Write-Host "Installing local Certificate Authority..." -ForegroundColor Cyan
mkcert -install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install local CA" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Local CA installed" -ForegroundColor Green
Write-Host ""

# Create certificates for localhost
Write-Host "Creating SSL certificates for localhost..." -ForegroundColor Cyan
mkcert localhost 127.0.0.1 ::1

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create certificates" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Certificates created:" -ForegroundColor Green
Write-Host "  - localhost.pem" -ForegroundColor White
Write-Host "  - localhost-key.pem" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✓ Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run 'npm run dev:preview' to start the preview server" -ForegroundColor White
Write-Host "2. Open Storyblok and configure the Visual Editor URL" -ForegroundColor White
Write-Host "   to: https://localhost:3010/storyblok-preview" -ForegroundColor White
Write-Host ""
