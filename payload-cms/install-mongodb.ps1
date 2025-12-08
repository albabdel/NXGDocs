# MongoDB Local Installation Script
Write-Host "Installing MongoDB Community Server..." -ForegroundColor Green

# Download MongoDB installer
$mongoUrl = "https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.14-signed.msi"
$installerPath = "$env:TEMP\mongodb-installer.msi"

Write-Host "Downloading MongoDB..." -ForegroundColor Yellow
Invoke-WebRequest -Uri $mongoUrl -OutFile $installerPath

Write-Host "Installing MongoDB (this may take a few minutes)..." -ForegroundColor Yellow
Start-Process msiexec.exe -ArgumentList "/i `"$installerPath`" /qn /norestart ADDLOCAL=`"ServerService,Client`" SHOULD_INSTALL_COMPASS=`"0`"" -Wait

# Add MongoDB to PATH
$mongoPath = "C:\Program Files\MongoDB\Server\7.0\bin"
$currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
if ($currentPath -notlike "*$mongoPath*") {
    [Environment]::SetEnvironmentVariable("Path", "$currentPath;$mongoPath", "Machine")
    $env:Path = "$env:Path;$mongoPath"
}

Write-Host "Starting MongoDB service..." -ForegroundColor Yellow
Start-Service MongoDB -ErrorAction SilentlyContinue

# Wait for service to start
Start-Sleep -Seconds 3

# Check if MongoDB is running
$mongoStatus = Get-Service MongoDB -ErrorAction SilentlyContinue
if ($mongoStatus.Status -eq "Running") {
    Write-Host "`n✅ MongoDB installed and running successfully!" -ForegroundColor Green
    Write-Host "`nYou can now start Payload CMS with:" -ForegroundColor Cyan
    Write-Host "  cd payload-cms" -ForegroundColor White
    Write-Host "  npm run dev" -ForegroundColor White
} else {
    Write-Host "`n⚠️ MongoDB installed but service not started." -ForegroundColor Yellow
    Write-Host "Try starting manually with: net start MongoDB" -ForegroundColor White
}

# Cleanup
Remove-Item $installerPath -ErrorAction SilentlyContinue
