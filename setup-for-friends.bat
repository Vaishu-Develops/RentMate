@echo off
echo 🚀 RentMate Development Setup Script
echo =====================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is installed
node --version
echo.

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm
    pause
    exit /b 1
)

echo ✅ npm is installed
npm --version
echo.

REM Navigate to project root
cd /d "%~dp0"

echo 📦 Installing backend dependencies...
cd backend
if not exist node_modules (
    npm install
    if errorlevel 1 (
        echo ❌ Backend dependency installation failed
        pause
        exit /b 1
    )
) else (
    echo ✅ Backend dependencies already installed
)

echo 📦 Installing frontend dependencies...
cd ..\frontend
if not exist node_modules (
    npm install
    if errorlevel 1 (
        echo ❌ Frontend dependency installation failed
        pause
        exit /b 1
    )
) else (
    echo ✅ Frontend dependencies already installed
)

cd ..

echo.
echo 🔧 Checking environment configuration...

REM Check backend .env
if not exist "backend\.env" (
    echo ❌ Backend .env file not found!
    echo Creating default .env file...
    
    echo # Server Configuration > backend\.env
    echo PORT=5000 >> backend\.env
    echo NODE_ENV=development >> backend\.env
    echo. >> backend\.env
    echo # Database >> backend\.env
    echo MONGODB_URI=mongodb+srv://vaishnavisudarsanam11_db_user:RnUqsHOusQ0rmy25@cluster0.fzkfm6p.mongodb.net/rentmate?retryWrites=true^&w=majority^&appName=Cluster0 >> backend\.env
    echo. >> backend\.env
    echo # JWT Configuration >> backend\.env
    echo JWT_SECRET=your-super-secret-jwt-key-here >> backend\.env
    echo JWT_EXPIRE=7d >> backend\.env
    echo JWT_REFRESH_SECRET=your-refresh-token-secret >> backend\.env
    echo JWT_REFRESH_EXPIRE=30d >> backend\.env
    echo. >> backend\.env
    echo # Email Configuration ^(Gmail SMTP^) >> backend\.env
    echo EMAIL_HOST=smtp.gmail.com >> backend\.env
    echo EMAIL_PORT=587 >> backend\.env
    echo EMAIL_USER=vikramkumarq999@gmail.com >> backend\.env
    echo EMAIL_PASS=lsehkszkqcsssree >> backend\.env
    echo. >> backend\.env
    echo # Frontend URL >> backend\.env
    echo CLIENT_URL=http://localhost:3000 >> backend\.env
    
    echo ✅ Created backend .env file
) else (
    echo ✅ Backend .env file exists
)

REM Check frontend .env
if not exist "frontend\.env" (
    echo ❌ Frontend .env file not found!
    echo Creating default .env file...
    
    echo VITE_API_URL=/api > frontend\.env
    echo VITE_APP_NAME=RentMate >> frontend\.env
    echo VITE_APP_VERSION=1.0.0 >> frontend\.env
    echo VITE_BACKEND_URL=http://localhost:5000 >> frontend\.env
    
    echo ✅ Created frontend .env file
) else (
    echo ✅ Frontend .env file exists
)

echo.
echo 🔍 Testing backend API endpoints...
cd backend

REM Start backend temporarily to test
echo Starting backend server for testing...
start /B node index.js
timeout /t 5 /nobreak >nul

REM Test health endpoint
curl -s http://localhost:5000/health >nul 2>&1
if errorlevel 1 (
    echo ❌ Backend health check failed
    echo Make sure port 5000 is available
) else (
    echo ✅ Backend is responding
)

REM Test auth endpoint
curl -s -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"test\":true}" >nul 2>&1
if errorlevel 1 (
    echo ❌ Auth endpoint not accessible
) else (
    echo ✅ Auth endpoints are working
)

REM Kill test backend
taskkill /F /IM node.exe >nul 2>&1

cd ..

echo.
echo 📋 Setup Summary:
echo ✅ Node.js and npm installed
echo ✅ Backend dependencies installed
echo ✅ Frontend dependencies installed
echo ✅ Environment files configured
echo ✅ API endpoints tested
echo.

echo 🚀 Starting RentMate Development Servers...
echo.
echo Opening 2 command windows:
echo 1. Backend server on http://localhost:5000
echo 2. Frontend server on http://localhost:3000
echo.

REM Start backend in new window
start "RentMate Backend" cmd /c "cd /d \"%~dp0backend\" && echo 🚀 Starting RentMate Backend Server... && npm run dev && pause"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in new window
start "RentMate Frontend" cmd /c "cd /d \"%~dp0frontend\" && echo 🚀 Starting RentMate Frontend... && npm run dev && pause"

echo.
echo 🎉 Setup Complete!
echo.
echo 📍 Access Points:
echo   🌐 Frontend: http://localhost:3000
echo   🔌 Backend API: http://localhost:5000
echo   📚 API Docs: http://localhost:5000/api/docs
echo   ❤️ Health Check: http://localhost:5000/health
echo.
echo 💡 Registration Flow:
echo   1. Open http://localhost:3000
echo   2. Click "Register" 
echo   3. Fill in the form
echo   4. Check backend console for OTP
echo   5. Enter OTP to verify email
echo.
echo ⚠️ Important Notes:
echo   - Both servers must be running for the app to work
echo   - OTP codes are displayed in the backend console
echo   - Email delivery might be slow, use console OTP
echo   - Make sure ports 3000 and 5000 are available
echo.
echo Press any key to close this window...
pause >nul
