@echo off
echo ========================================
echo NXGEN Documentation Admin Panel
echo ========================================
echo.
echo Starting services...
echo.
echo [1/2] Starting Decap Server (local backend)...
start "Decap Server" cmd /k "cd /d %~dp0 && npx decap-server"
timeout /t 3 /nobreak >nul

echo [2/2] Starting Docusaurus development server...
start "Docusaurus" cmd /k "cd /d %~dp0 && npm start"

echo.
echo ========================================
echo Services started!
echo ========================================
echo.
echo Admin Panel will be available at:
echo http://localhost:3000/admin
echo.
echo Press any key to close this window...
echo (The servers will continue running)
pause >nul
