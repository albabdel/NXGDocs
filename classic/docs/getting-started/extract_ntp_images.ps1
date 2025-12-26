# Extract base64 images from NTP.md
$ntpFile = Join-Path $PSScriptRoot "NTP.md"
$imagesDir = Join-Path $PSScriptRoot "images"

if (-not (Test-Path $imagesDir)) {
    New-Item -ItemType Directory -Path $imagesDir | Out-Null
}

$content = Get-Content $ntpFile -Raw -Encoding UTF8
$pattern = '\[image(\d+)\]:\s*<data:image/(\w+);base64,([^>]+)>'
$matches = [regex]::Matches($content, $pattern)

Write-Host "Found $($matches.Count) images to extract..."

foreach ($match in $matches) {
    $num = $match.Groups[1].Value
    $ext = $match.Groups[2].Value
    $data = $match.Groups[3].Value
    
    try {
        $bytes = [Convert]::FromBase64String($data)
        $path = Join-Path $imagesDir "ntp-step-$num.$ext"
        [System.IO.File]::WriteAllBytes($path, $bytes)
        Write-Host "✓ Extracted: ntp-step-$num.$ext ($($bytes.Length) bytes)"
    } catch {
        Write-Host "✗ Error extracting image $num : $_"
    }
}

Write-Host "`nExtraction complete! Images saved to: $imagesDir"

