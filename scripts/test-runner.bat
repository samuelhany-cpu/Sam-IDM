@echo off
echo ========================================
echo  Sam Download Manager - Test Runner
echo ========================================
echo.
echo Starting application with test runner...
echo.

REM Set environment variable to load test runner
set ELECTRON_TEST_MODE=true

REM Build main process first
echo Building main process...
call npm run build:main

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo Starting Electron with test runner...
echo.

REM Start electron
npx electron .

pause
