@echo off
title Telecom Billing System - Auto Start
echo Launching Telecom Billing System...

:: Start Backend in a new window
echo Launching Backend...
start cmd /k "cd /d %~dp0backend && npm start"

:: Start Frontend in a new window
echo Launching Frontend...
start cmd /k "cd /d %~dp0frontend && npm run dev"

echo All services are starting. You can close this window.
timeout /t 5
exit
