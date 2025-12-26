@echo off
echo ============================================================
echo  NXGEN DOCS - NETLIFY DEPLOYMENT AND IMAGE UPLOAD
echo ============================================================
echo.

cd classic

echo Step 1: Creating new Netlify site...
echo.
echo Please select your team when prompted.
echo.
netlify sites:create --name nxgen-docs-%RANDOM%

if errorlevel 1 (
    echo.
    echo Error creating site. Please run manually:
    echo   cd classic
    echo   netlify sites:create
    pause
    exit /b 1
)

echo.
echo ============================================================
echo Step 2: Deploying to Netlify...
echo ============================================================
echo.

netlify deploy --prod --dir=build

if errorlevel 1 (
    echo.
    echo Error deploying. Please check the error above.
    pause
    exit /b 1
)

echo.
echo ============================================================
echo Step 3: Getting site URL...
echo ============================================================
echo.

netlify status > temp_status.txt
findstr "Site URL" temp_status.txt
del temp_status.txt

echo.
echo ============================================================
echo.
echo DEPLOYMENT COMPLETE!
echo.
echo Please copy the "Site URL" shown above.
echo You'll need it for the image upload.
echo.
echo Next: Run the image upload script:
echo   npm run upload:bulk YOUR_SITE_URL
echo.
echo ============================================================
pause
