# 🚨 RentMate Troubleshooting Guide

## Common Registration Issues & Solutions

### ❌ Error: "Route /api/auth/register not found"

**CAUSE:** Frontend trying to connect to wrong backend URL or backend not running.

**SOLUTIONS:**

1. **Check if backend is running:**
   ```bash
   # Open command prompt and go to backend folder
   cd backend
   npm run dev
   
   # You should see:
   # ✅ RentMate API Server is running!
   # 🌐 Port: 5000
   ```

2. **Check if frontend is using correct API URL:**
   - Frontend should run on: `http://localhost:3000`
   - Backend should run on: `http://localhost:5000`
   - Frontend `.env` should have: `VITE_API_URL=/api`

3. **Test backend directly:**
   ```bash
   # In browser, visit:
   http://localhost:5000/health
   
   # Should show:
   {"success":true,"message":"RentMate API is running"}
   ```

---

### ❌ Error: "ECONNREFUSED" or "Network Error"

**CAUSE:** Backend server is not running or wrong port.

**SOLUTIONS:**

1. **Start backend server:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Check port availability:**
   ```bash
   netstat -an | findstr :5000
   # Should show: TCP 0.0.0.0:5000 LISTENING
   ```

3. **Kill conflicting processes:**
   ```bash
   # Windows:
   taskkill /F /IM node.exe
   
   # Then restart backend
   cd backend && npm run dev
   ```

---

### ❌ Error: "Cannot read properties of undefined"

**CAUSE:** Missing dependencies or environment variables.

**SOLUTIONS:**

1. **Reinstall dependencies:**
   ```bash
   # Backend
   cd backend
   rm -rf node_modules package-lock.json
   npm install
   
   # Frontend  
   cd ../frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check environment files:**
   - `backend/.env` must exist
   - `frontend/.env` must exist
   - Use the setup script: `setup-for-friends.bat`

---

### ❌ Error: "OTP not received" or "Email verification failed"

**CAUSE:** Email delivery issues (normal in development).

**SOLUTIONS:**

1. **Use console OTP (Recommended for development):**
   - Register new user
   - Check backend console/terminal
   - Look for: `🔑 VERIFICATION CODE (backup): 123456`
   - Use that 6-digit code for verification

2. **Backend console should show:**
   ```
   📧 Development mode: Email sending in background...
   📧 Verification Code: ABC123
   ```

---

## 🔧 Quick Setup for New Users

### Step 1: Prerequisites
- Install Node.js (v16+): https://nodejs.org/
- Install Git: https://git-scm.com/

### Step 2: Clone & Setup
```bash
# Clone the repository
git clone <repository-url>
cd RentMate_Hackathon

# Run automatic setup (Windows)
setup-for-friends.bat

# OR manual setup:
cd backend && npm install
cd ../frontend && npm install
```

### Step 3: Start Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### Step 4: Test Registration
1. Open: http://localhost:3000
2. Click "Register"
3. Fill form with valid email
4. Submit form
5. Check backend terminal for OTP
6. Enter OTP in verification screen

---

## 🌐 Environment Configuration

### Backend `.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://vaishnavisudarsanam11_db_user:RnUqsHOusQ0rmy25@cluster0.fzkfm6p.mongodb.net/rentmate?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=vikramkumarq999@gmail.com
EMAIL_PASS=lsehkszkqcsssree
CLIENT_URL=http://localhost:3000
```

### Frontend `.env` file:
```env
VITE_API_URL=/api
VITE_APP_NAME=RentMate
VITE_APP_VERSION=1.0.0
VITE_BACKEND_URL=http://localhost:5000
```

---

## 🧪 API Testing

### Test endpoints manually:

1. **Health Check:**
   ```
   GET http://localhost:5000/health
   ```

2. **User Registration:**
   ```
   POST http://localhost:5000/api/auth/register
   Content-Type: application/json
   
   {
     "name": "Test User",
     "email": "test@example.com", 
     "password": "TestPass123!",
     "confirmPassword": "TestPass123!",
     "phone": "+919876543210",
     "agreeToTerms": true
   }
   ```

3. **OTP Verification:**
   ```
   POST http://localhost:5000/api/auth/verify-email
   Content-Type: application/json
   
   {
     "email": "test@example.com",
     "otp": "123456"
   }
   ```

---

## 🐛 Debug Mode

### Enable detailed logging:

1. **Backend debugging:**
   ```bash
   cd backend
   DEBUG=* npm run dev
   ```

2. **Frontend debugging:**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

---

## 📞 Getting Help

### When asking for help, include:

1. **Error message (exact text)**
2. **Screenshot of error** 
3. **Steps you tried**
4. **Browser console errors (F12)**
5. **Node.js version:** `node --version`
6. **npm version:** `npm --version`
7. **Operating system**

### Quick diagnostic commands:
```bash
# Check Node.js
node --version

# Check npm  
npm --version

# Check if ports are free
netstat -an | findstr :3000
netstat -an | findstr :5000

# Check running processes
tasklist | findstr node
```

---

## ✅ Success Checklist

- [ ] Node.js installed (v16+)
- [ ] Both `backend` and `frontend` folders have `node_modules`
- [ ] Backend `.env` file exists and configured
- [ ] Frontend `.env` file exists and configured  
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] http://localhost:5000/health returns success
- [ ] http://localhost:3000 loads the website
- [ ] Registration form submits without network errors
- [ ] OTP appears in backend console after registration
- [ ] OTP verification works

**If all checked ✅ - Registration should work perfectly!**
