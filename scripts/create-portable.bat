@echo off
echo Creating portable ZIP for Sam Download Manager...
cd release
powershell Compress-Archive -Path "win-unpacked" -DestinationPath "Sam-Download-Manager-Portable.zip" -Force
echo.
echo Done! Created: Sam-Download-Manager-Portable.zip
echo Location: F:\IDM Sam\release\
pause
