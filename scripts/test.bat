@echo off
echo ========================================
echo   Testing Sam Download Manager
echo ========================================
echo.

echo Building main process...
call npm run build:main
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo Starting app...
echo.
echo TESTING INSTRUCTIONS:
echo ====================
echo 1. The app will open with DevTools
echo 2. Click "Add Download" button
echo 3. Paste your MediaFire URL
echo 4. Watch the Console tab in DevTools for:
echo    - [Download Manager] logs showing progress
echo    - Redirect handling (if any)
echo    - Download segments
echo    - Completion status
echo.
echo 5. Check your Downloads folder for the file
echo.
echo Press Ctrl+C to stop when done testing
echo.

set ELECTRON_START_URL=http://localhost:5173
start "Vite Dev Server" cmd /k "npm run dev:vite"
timeout /t 5 >nul
npx electron .

taskkill /FI "WindowTitle eq Vite Dev Server*" /T /F >nul 2>&1
