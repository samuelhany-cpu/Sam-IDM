@echo off
echo ========================================
echo   Sam Download Manager - Installation
echo ========================================
echo.

echo [1/3] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo.

echo [2/3] Building application...
call npm run build:main
if %errorlevel% neq 0 (
    echo ERROR: Failed to build main process
    pause
    exit /b 1
)
echo.

echo [3/3] Setup complete!
echo.
echo To start the application, run: npm start
echo To start in development mode, run: npm run dev
echo To create installer, run: npm run package
echo.
pause
