@echo off
title Birthday Website Host
cd /d "%~dp0"

echo ========================================================
echo          STARTING BIRTHDAY WEBSITE SERVER
echo ========================================================
echo.

:: Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found on your system!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: Check if node_modules exists, install if missing
if not exist "node_modules\" (
    echo [INFO] First time setup: Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
)

echo.
echo ========================================================
echo  Hosting website...
echo  - Opening your default browser automatically.
echo  - To view on mobile, connect to the same Wi-Fi
echo    and open the "Network" URL shown below.
echo.
echo  Press Ctrl+C in this window when you want to stop.
echo ========================================================
echo.

call npm run dev -- --host --open

pause

