# Quick Redeploy Script for Vercel
Write-Host "Redeploying to Vercel..." -ForegroundColor Cyan
Write-Host ""

cd c:\nxgen-docs\classic

# Force redeploy to production
vercel --prod --force

Write-Host ""
Write-Host "Deployment initiated!" -ForegroundColor Green
Write-Host "Check your Vercel dashboard for progress." -ForegroundColor Yellow
