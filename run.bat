@echo off
echo ========================================
echo   Sam Download Manager
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
echo Starting application with simple UI...
echo.
echo For full React UI, run: dev.bat
echo.
npx electron .
