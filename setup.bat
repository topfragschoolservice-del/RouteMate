@echo off
REM Create folder structure
mkdir "d:\Root mate\RouteMate\routes"
mkdir "d:\Root mate\RouteMate\services"
mkdir "d:\Root mate\RouteMate\tracking"
mkdir "d:\Root mate\RouteMate\frontend"

REM Install dependencies
cd /d "d:\Root mate\RouteMate"
call npm install

echo Folder structure created and dependencies installed!
pause
