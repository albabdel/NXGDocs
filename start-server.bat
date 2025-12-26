@echo off
echo.
echo ========================================
echo  Starting Docusaurus with Hygraph
echo ========================================
echo.

cd classic

echo Fetching latest content from Hygraph...
call npm run fetch-content

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Failed to fetch content from Hygraph
    echo Check your .env.local file and credentials
    pause
    exit /b 1
)

echo.
echo Starting development server...
echo Open your browser to: http://localhost:3002
echo.
echo Press Ctrl+C to stop the server
echo.

npx docusaurus start --port 3002 --host 0.0.0.0

pause
