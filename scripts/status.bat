@echo off
cls
echo.
echo ========================================
echo    Sam Download Manager - Status
echo ========================================
echo.
echo Checking installation...
echo.

if not exist "node_modules\" (
    echo [X] Dependencies NOT installed
    echo     Run: npm install
    goto end
) else (
    echo [✓] Dependencies installed
)

if not exist "dist\main\main.js" (
    echo [X] Main process NOT built
    echo     Run: npm run build:main
    goto end
) else (
    echo [✓] Main process built
)

echo.
echo ========================================
echo    All systems ready!
echo ========================================
echo.
echo To start the application:
echo   1. Double-click "run.bat"
echo   2. Or run: npm start
echo.
echo TypeScript errors in VS Code are normal
echo and won't affect the application!
echo.

:end
pause
