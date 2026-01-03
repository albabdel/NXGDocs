# Comprehensive script to find and remove broken links from all files
$brokenPaths = @(
    "devices/hikvision/admin-configuration",
    "devices/hikvision/installer-configuration",
    "devices/hikvision/overview",
    "devices/hikvision/supported-features",
    "devices/hikvision/troubleshooting",
    "devices/honeywell/configuration",
    "devices/honeywell/overview",
    "devices/honeywell/troubleshooting",
    "devices/innovi/configuration",
    "devices/innovi/overview",
    "devices/innovi/troubleshooting",
    "devices/axis/installer-configuration",
    "devices/axxon/installer-configuration",
    "devices/gcxone-audio/installer-configuration",
    "devices/hanwha/installer-configuration",
    "devices/heitel/installer-configuration",
    "devices/innovi/installer-configuration",
    "devices/milestone/installer-configuration",
    "devices/teltonika/installer-configuration",
    "devices/generic/limitations",
    "devices/milestone/admin-configuration",
    "devices/milestone/configuration",
    "devices/milestone/overview",
    "devices/milestone/troubleshooting",
    "devices/miwi/configuration",
    "devices/miwi/overview",
    "devices/miwi/troubleshooting",
    "devices/mobotix/configuration",
    "devices/mobotix/overview",
    "devices/mobotix/troubleshooting",
    "devices/nxgcloudnvr/configuration",
    "devices/nxgcloudnvr/overview",
    "devices/nxgcloudvisionedge/configuration",
    "devices/nxgcloudvisionedge/overview",
    "devices/nxgcloudvisionedge/troubleshooting",
    "devices/nxgcloudnvr/troubleshooting",
    "devices/nxwitness/troubleshooting",
    "devices/nxwitness/configuration",
    "devices/nxwitness/overview",
    "devices/netvue/configuration",
    "devices/netvue/overview",
    "devices/netvue/troubleshooting",
    "devices/onvif/configuration",
    "devices/onvif/overview",
    "devices/general/onboarding-overview",
    "devices/onvif/troubleshooting",
    "devices/generic/onvif-integration",
    "devices/adpro/operator-view",
    "devices/avigilon/operator-view",
    "devices/axis/operator-view",
    "devices/axxon/operator-view",
    "devices/camect/operator-view",
    "devices/dahua/operator-view",
    "devices/gcxone-audio/operator-view",
    "devices/hanwha/operator-view",
    "devices/heitel/operator-view",
    "devices/hikvision/operator-view",
    "devices/innovi/operator-view",
    "devices/milestone/operator-view",
    "devices/reconeyez/operator-view",
    "devices/teltonika/operator-view",
    "devices/gcxone-audio/overview",
    "devices/reconeyez/admin-configuration",
    "devices/reconeyez/installer-configuration",
    "devices/reconeyez/overview",
    "devices/reconeyez/troubleshooting",
    "devices/rosenberger/configuration",
    "devices/rosenberger/overview",
    "devices/rosenberger/troubleshooting",
    "devices/generic/rtsp-configuration",
    "devices/spykebox/configuration",
    "devices/spykebox/overview",
    "devices/spykebox/troubleshooting",
    "devices/senstar/installer-configuration",
    "devices/axxon/supported-features",
    "devices/camect/supported-features",
    "devices/gcxone-audio/supported-features",
    "devices/hanwha/supported-features",
    "devices/heitel/supported-features",
    "devices/innovi/supported-features",
    "devices/milestone/supported-features",
    "devices/reconeyez/supported-features",
    "devices/teltonika/supported-features",
    "devices/general/troubleshooting-basics",
    "devices/teltonika/admin-configuration",
    "devices/teltonika/overview",
    "devices/camect/troubleshooting",
    "devices/gcxone-audio/troubleshooting",
    "devices/teltonika/troubleshooting",
    "devices/uniview/installer-configuration",
    "devices/uniview/overview",
    "devices/viasys/configuration",
    "devices/viasys/overview",
    "devices/viasys/troubleshooting",
    "devices/victron/configuration",
    "devices/victron/overview",
    "devices/victron/troubleshooting",
    "features/ai-analytics/overview",
    "features/ai-analytics/configuration",
    "features/audio-detection/configuration",
    "features/event-clips/configuration",
    "features/face-detection/configuration",
    "features/heat-mapping/configuration",
    "features/intrusion-detection/configuration",
    "features/license-plate/configuration",
    "features/line-crossing/configuration",
    "features/motion-detection/configuration",
    "features/people-counting/configuration",
    "features/tamper-detection/configuration",
    "features/event-clips/overview",
    "features/live-view/configuration",
    "features/live-view/overview",
    "features/live-view/troubleshooting",
    "features/local-mode/configuration",
    "features/local-mode/overview",
    "features/audio-detection/overview",
    "features/face-detection/overview",
    "features/heat-mapping/overview",
    "features/intrusion-detection/overview",
    "features/license-plate/overview",
    "features/line-crossing/overview",
    "features/motion-detection/overview",
    "features/people-counting/overview",
    "features/tamper-detection/overview",
    "features/ptz-control/configuration",
    "features/ptz-control/overview",
    "features/ptz-control/troubleshooting",
    "features/playback/configuration",
    "features/playback/overview",
    "features/playback/troubleshooting",
    "features/ai-analytics/troubleshooting",
    "features/audio-detection/troubleshooting",
    "features/event-clips/troubleshooting",
    "features/face-detection/troubleshooting",
    "features/heat-mapping/troubleshooting",
    "features/intrusion-detection/troubleshooting",
    "features/license-plate/troubleshooting",
    "features/line-crossing/troubleshooting",
    "features/motion-detection/troubleshooting",
    "features/people-counting/troubleshooting",
    "features/tamper-detection/troubleshooting",
    "features/twilio-conference-mode",
    "features/video-streaming/configuration",
    "features/video-streaming/overview",
    "features/video-streaming/troubleshooting",
    "getting-started/devices/adpro/overview",
    "getting-started/devices/ajax/overview",
    "getting-started/alarm-forwarding",
    "getting-started/troubleshooting/overflow-thresholds",
    "getting-started/features/audio-routing",
    "getting-started/devices/avigilon/overview",
    "getting-started/devices/axis-camera-station/overview",
    "getting-started/bandwidth-requirementsx",
    "getting-started/troubleshooting/browser-errors",
    "getting-started/devices/camect/overview",
    "getting-started/cloud-architecture",
    "getting-started/user-management/creating-roles",
    "getting-started/user-management/customer-groups",
    "getting-started/devices/dahua-dolynk/overview",
    "getting-started/devices/dahua/overview",
    "getting-started/devices/eagle-eye/overview",
    "getting-started/firewall-configuration",
    "getting-started/first-time-login",
    "getting-started/gcxone-talos-interaction",
    "getting-started/devices/ganz/overview",
    "getting-started/getting-to-know-evalink-talos",
    "getting-started/devices/hikvision/overview",
    "getting-started/next/IMPLEMENTATION_PHASE2",
    "getting-started/ip-whitelisting",
    "getting-started/troubleshooting/image-and-video-issues",
    "getting-started/next/IMPLEMENTATION_REVIEW",
    "getting-started/next/IMPLEMENTATION_SUMMARY",
    "getting-started/user-management/inviting-users",
    "getting-started/key-benefits",
    "getting-started/user-management/managing-users",
    "getting-started/ntp-configuration",
    "getting-started/password-management",
    "getting-started/features/feature-list",
    "getting-started/quick-start-checklist",
    "getting-started/devices/reconeyez/overview",
    "getting-started/required-ports",
    "getting-started/talos/roles-and-permissions",
    "getting-started/user-management/roles-and-access-levels",
    "getting-started/devices/senstar/overview",
    "getting-started/talos/site-management",
    "getting-started/user-management/talos-user-management"
)

$extensions = @('.ts', '.tsx', '.js', '.jsx', '.md', '.mdx')
$searchDirs = @('classic', 'content-staging')
$totalRemoved = 0
$filesModified = @()

function Remove-BrokenLinks {
    param(
        [string]$FilePath,
        [string[]]$BrokenPaths
    )
    
    $content = Get-Content -Path $FilePath -Raw -Encoding UTF8 -ErrorAction SilentlyContinue
    if (-not $content) { return 0 }
    
    $originalContent = $content
    $removedCount = 0
    
    foreach ($brokenPath in $BrokenPaths) {
        $escapedPath = [regex]::Escape($brokenPath)
        
        # Pattern 1: Markdown links: [text](/docs/path) or [text](/docs/path.md)
        $pattern1 = "\[([^\]]*)\]\(/docs/$escapedPath(\.md)?(#[^\)]*)?\)"
        if ($content -match $pattern1) {
            $content = $content -replace $pattern1, ''
            $removedCount++
        }
        
        # Pattern 2: Relative markdown links: [text](path) or [text](path.md)
        $pattern2 = "\[([^\]]*)\]\($escapedPath(\.md)?(#[^\)]*)?\)"
        if ($content -match $pattern2) {
            $content = $content -replace $pattern2, ''
            $removedCount++
        }
        
        # Pattern 3: URL properties in JS/TS: url: "/docs/path" or link: '/docs/path'
        $pattern3 = "(url|link|to|configLink):\s*['`"]/docs/$escapedPath(\.md)?['`"]"
        if ($content -match $pattern3) {
            $content = $content -replace $pattern3, ''
            $removedCount++
        }
        
        # Pattern 4: String literals in sidebars: 'path' or "path"
        $pattern4 = "['`"]$escapedPath['`"]"
        if ($content -match $pattern4) {
            # Only remove if it's a standalone string literal (not part of a larger string)
            $lines = $content -split "`n"
            $newLines = @()
            foreach ($line in $lines) {
                if ($line -match "['`"]$escapedPath['`"]" -and $line.Trim() -match "^['`"]$escapedPath['`"]") {
                    # Skip this line entirely if it's just the broken path
                    continue
                }
                # Remove the broken path from the line if it appears as a string literal
                $cleanedLine = $line -replace "['`"]$escapedPath['`"],?", ''
                $cleanedLine = $cleanedLine -replace ",\s*['`"]$escapedPath['`"]", ''
                if ($cleanedLine.Trim() -ne '') {
                    $newLines += $cleanedLine
                }
            }
            if ($newLines.Count -ne $lines.Count) {
                $content = $newLines -join "`n"
                $removedCount++
            }
        }
        
        # Pattern 5: Full path with /docs prefix
        $pattern5 = "/docs/$escapedPath"
        if ($content -match $pattern5) {
            $content = $content -replace $pattern5, ''
            $removedCount++
        }
    }
    
    # Clean up empty lines (3+ consecutive newlines -> 2)
    $content = $content -replace "(`r?`n){3,}", "`r`n`r`n"
    
    # Clean up trailing commas on their own lines
    $content = $content -replace ",(\s*`r?`n\s*})", '$1'
    $content = $content -replace ",(\s*`r?`n\s*])", '$1'
    
    if ($content -ne $originalContent) {
        Set-Content -Path $FilePath -Value $content -Encoding UTF8 -NoNewline
        return $removedCount
    }
    
    return 0
}

Write-Host "Scanning for broken links..." -ForegroundColor Yellow
Write-Host ""

foreach ($dir in $searchDirs) {
    if (-not (Test-Path $dir)) {
        continue
    }
    
    $files = Get-ChildItem -Path $dir -Recurse -Include $extensions -File | 
        Where-Object { $_.FullName -notmatch 'node_modules|\.git|build|dist' }
    
    foreach ($file in $files) {
        $removed = Remove-BrokenLinks -FilePath $file.FullName -BrokenPaths $brokenPaths
        if ($removed -gt 0) {
            $totalRemoved += $removed
            $filesModified += $file.FullName
            Write-Host "  Fixed: $($file.FullName) (removed $removed references)" -ForegroundColor Green
        }
    }
}

Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "  Files modified: $($filesModified.Count)" -ForegroundColor Cyan
Write-Host "  Total references removed: $totalRemoved" -ForegroundColor Cyan
Write-Host ""

if ($filesModified.Count -gt 0) {
    Write-Host "Modified files:" -ForegroundColor Yellow
    foreach ($file in $filesModified) {
        Write-Host "  - $file" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Green

