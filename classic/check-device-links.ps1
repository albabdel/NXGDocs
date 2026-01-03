$deviceLinks = @(
    '/docs/devices/hikvision/overview',
    '/docs/devices/hikpro/overview',
    '/docs/devices/dahua/overview',
    '/docs/devices/dahua/dolynk-setup',
    '/docs/devices/nxwitness/overview',
    '/docs/devices/hanwha/overview',
    '/docs/devices/digitalwatchdog/overview',
    '/docs/devices/genesisvms/overview',
    '/docs/devices/nxgcloudnvr/overview',
    '/docs/devices/nxgcloudvisionedge/overview',
    '/docs/devices/spykebox/overview',
    '/docs/devices/camect/overview',
    '/docs/devices/ganz/overview',
    '/docs/devices/avigilon/overview',
    '/docs/devices/axxon/overview',
    '/docs/devices/milestone/overview',
    '/docs/devices/axiscamerastation/overview',
    '/docs/devices/heitel/overview',
    '/docs/devices/uniview/overview',
    '/docs/devices/viasys/overview',
    '/docs/devices/axis/overview',
    '/docs/devices/senstar/overview',
    '/docs/devices/netvue/overview',
    '/docs/devices/honeywell/overview',
    '/docs/devices/davantis/overview',
    '/docs/devices/genesisaudio/overview',
    '/docs/devices/teltonika/overview',
    '/docs/devices/efoy/overview',
    '/docs/devices/victron/overview',
    '/docs/devices/ajax/overview',
    '/docs/devices/essence/overview',
    '/docs/devices/reconeyez/overview',
    '/docs/devices/innovi/overview',
    '/docs/devices/rosenberger/overview',
    '/docs/devices/autoaid/overview',
    '/docs/devices/auraigateway/overview',
    '/docs/devices/onvif/overview',
    '/docs/devices/mobotix/overview',
    '/docs/devices/eneo/overview',
    '/docs/devices/eneoip/overview',
    '/docs/devices/axiscspro/overview',
    '/docs/devices/geutebruck/overview',
    '/docs/devices/miwi/overview'
)

$uniqueLinks = $deviceLinks | Sort-Object | Get-Unique

Write-Host "Checking device documentation links..." -ForegroundColor Yellow
Write-Host ""

$existingCount = 0
$missingCount = 0
$missingFiles = @()

foreach ($link in $uniqueLinks) {
    $filePath = "docs" + $link.Substring(5) + ".md"
    
    if (Test-Path $filePath) {
        Write-Host "✅ EXISTS: $link" -ForegroundColor Green
        $existingCount++
    } else {
        Write-Host "❌ MISSING: $link (expected: $filePath)" -ForegroundColor Red
        $missingCount++
        $missingFiles += $link
    }
}

Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "✅ Existing: $existingCount" -ForegroundColor Green
Write-Host "❌ Missing: $missingCount" -ForegroundColor Red
Write-Host "📊 Total: $($existingCount + $missingCount)" -ForegroundColor Cyan

# Save missing files list
$missingFiles | Out-File -FilePath "missing-device-docs.txt" -Encoding UTF8

Write-Host ""
Write-Host "Missing files list saved to: missing-device-docs.txt" -ForegroundColor Yellow