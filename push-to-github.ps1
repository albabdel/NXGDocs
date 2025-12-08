cd c:\nxgen-docs
Write-Host "Current directory: $(Get-Location)"
Write-Host "`n=== Git Remote Configuration ===" 
git remote -v
Write-Host "`n=== Git Status ===" 
git status --short | Select-Object -First 10
Write-Host "`n=== Last Commit ===" 
git log --oneline -1
Write-Host "`n=== Attempting Push ===" 
git push -u origin main 2>&1
Write-Host "`n=== Push Complete ===" 
