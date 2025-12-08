@echo off
echo Starting Strapi setup...
echo.

echo Installing dependencies...
call npm install
echo.

echo Starting Strapi (this will take 20-30 seconds)...
start /B cmd /c "npm run develop > strapi.log 2>&1"
timeout /t 30 /nobreak > nul
echo.

echo Running automated setup...
call npm run setup
echo.

echo ========================================
echo Automated setup complete!
echo ========================================
echo.
echo Strapi is running at: http://localhost:1337/admin
echo.
echo IMPORTANT: Complete these 2 manual steps:
echo.
echo 1. Configure API Permissions (2 min):
echo    http://localhost:1337/admin/settings/users-permissions/roles
echo    - Click "Public" role
echo    - Enable find/findOne for Category and Documentation-article
echo    - Click Save
echo.
echo 2. Generate API Token (1 min):
echo    http://localhost:1337/admin/settings/api-tokens
echo    - Create new token
echo    - Name: Docusaurus Sync
echo    - Type: Full access
echo    - Copy and save the token
echo.
echo See SETUP_COMPLETE.md for detailed instructions
echo.
pause
