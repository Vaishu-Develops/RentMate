@echo off
echo Starting RentMate Development Servers...
echo.

echo Checking if ports are available...
netstat -ano | findstr :5000 > nul
if %errorlevel% == 0 (
    echo WARNING: Port 5000 is already in use!
    echo Please stop any running backend servers first.
    pause
    exit /b 1
)

netstat -ano | findstr :3000 > nul
if %errorlevel% == 0 (
    echo WARNING: Port 3000 is already in use!
    echo Please stop any running frontend servers first.
    pause
    exit /b 1
)

echo Ports are available. Starting servers...
echo.

echo Starting Backend Server...
start "RentMate Backend" cmd /k "cd backend && npm run dev"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend Server...
start "RentMate Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this script (servers will continue running)
pause > nul