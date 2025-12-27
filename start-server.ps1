# Start Docusaurus Development Server
# This script finds an available port and starts the server

Write-Host "🚀 Starting Docusaurus with Hygraph Content..." -ForegroundColor Cyan

# Navigate to classic directory
Set-Location -Path "$PSScriptRoot\classic"

# Try ports 3000-3010
$portFound = $false
for ($port = 3000; $port -le 3010; $port++) {
    $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if (-not $connection) {
        Write-Host "✅ Port $port is available" -ForegroundColor Green
        Write-Host "📦 Fetching latest content from Hygraph..." -ForegroundColor Yellow

        # Fetch content first
        npm run fetch-content

        if ($LASTEXITCODE -eq 0) {
            Write-Host "🌐 Starting development server on port $port..." -ForegroundColor Green
            Write-Host "📝 Open your browser to: http://localhost:$port" -ForegroundColor Cyan
            Write-Host ""

            # Start server
            npx docusaurus start --port $port --host 0.0.0.0
        } else {
            Write-Host "❌ Failed to fetch content from Hygraph" -ForegroundColor Red
            Write-Host "   Check your .env.local file and Hygraph credentials" -ForegroundColor Yellow
        }

        $portFound = $true
        break
    }
}

if (-not $portFound) {
    Write-Host "❌ No available ports found between 3000-3010" -ForegroundColor Red
    Write-Host "   Please close some running servers and try again" -ForegroundColor Yellow
}
