@echo off
echo ========================================
echo   Sam Download Manager - Dev Mode
echo ========================================
echo.

echo [1/3] Building main process...
call npm run build:main
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo [2/3] Starting Vite dev server...
start "Vite Dev Server" cmd /k "npm run dev:vite"

echo Waiting for Vite to start...
timeout /t 5 >nul

echo.
echo [3/3] Starting Electron...
set ELECTRON_START_URL=http://localhost:5173
npx electron .

echo.
echo App closed. Press any key to stop Vite server...
pause >nul
taskkill /FI "WindowTitle eq Vite Dev Server*" /T /F >nul 2>&1
