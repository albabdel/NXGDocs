@echo off
echo ========================================
echo Strapi CMS Complete Setup
echo ========================================
echo.

cd strapi-cms

echo Step 1: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo.

echo Step 2: Starting Strapi in background...
echo Please wait 30 seconds for Strapi to start...
start /B npm run develop > strapi.log 2>&1
timeout /t 30 /nobreak > nul
echo.

echo Step 3: Running automated setup...
call npm run setup
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps (manual - 3 minutes):
echo.
echo 1. Open http://localhost:1337/admin
echo 2. Configure API permissions:
echo    - Settings ^> Users ^& Permissions ^> Roles ^> Public
echo    - Enable 'find' and 'findOne' for Category and Documentation-article
echo    - Click Save
echo.
echo 3. Generate API token:
echo    - Settings ^> API Tokens ^> Create new
echo    - Name: Docusaurus Sync
echo    - Type: Full access
echo    - Copy the token
echo.
echo 4. Test API:
echo    curl http://localhost:1337/api/categories
echo.
pause
