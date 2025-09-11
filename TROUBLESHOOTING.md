# RentMate Frontend Troubleshooting Guide

## 🚨 Current Issue: ERR_NETWORK_CHANGED

The errors you're seeing indicate that the Vite development server is having network connectivity issues. Here's how to fix it:

## 🔧 Quick Fix Steps

### 1. Stop All Running Servers
```bash
# Press Ctrl+C in all terminal windows to stop any running servers
```

### 2. Clear Node Modules and Reinstall (Frontend)
```bash
cd frontend
rm -rf node_modules
rm package-lock.json
npm install
```

### 3. Clear Vite Cache
```bash
cd frontend
npx vite --force
# OR
rm -rf node_modules/.vite
```

### 4. Check Port Availability
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000
# If something is using it, kill the process or use a different port
```

### 5. Start Frontend with Different Port
```bash
cd frontend
npm run dev -- --port 3001
```

### 6. Alternative: Use Basic Vite Config
Create a minimal `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: true,
    strictPort: false,
  },
})
```

## 🔍 Detailed Diagnosis

### Check if Backend is Running
```bash
cd backend
npm run dev
# Should show: Server running on http://localhost:5000
```

### Test Backend API
```bash
curl http://localhost:5000/health
# Should return: {"success":true,"message":"RentMate API is running"}
```

### Check Frontend Dependencies
```bash
cd frontend
npm list --depth=0
# Look for any missing or conflicting packages
```

## 🚀 Complete Restart Process

### 1. Backend Setup
```bash
cd backend
npm install
# Make sure .env file exists with correct MongoDB URI
npm run dev
```

### 2. Frontend Setup (New Terminal)
```bash
cd frontend
npm install
npm run dev
```

## 🔧 Alternative Solutions

### Option 1: Use Different Ports
If port conflicts exist:

**Backend (.env):**
```
PORT=5001
```

**Frontend (vite.config.js):**
```javascript
server: {
  port: 3001,
  proxy: {
    '/api': {
      target: 'http://localhost:5001',
      changeOrigin: true,
    },
  },
}
```

### Option 2: Disable Network Features Temporarily
Update `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: '127.0.0.1', // Use localhost instead of 0.0.0.0
  },
})
```

### Option 3: Check Windows Firewall
If on Windows, temporarily disable firewall or add exceptions for:
- Node.js
- Port 3000
- Port 5000

## 🐛 Common Issues & Solutions

### Issue: "Module not found" errors
**Solution:**
```bash
cd frontend
npm install @tabler/icons-react lucide-react framer-motion
```

### Issue: "Cannot resolve '@/components/ui/...'"
**Solution:** Check that the alias is correctly set in `vite.config.js`

### Issue: Zustand middleware errors
**Solution:**
```bash
cd frontend
npm install zustand@latest
```

### Issue: React Hook Form errors
**Solution:**
```bash
cd frontend
npm install react-hook-form@latest
```

## 📋 Verification Checklist

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] No port conflicts
- [ ] All dependencies installed
- [ ] .env files configured correctly
- [ ] Firewall not blocking connections

## 🆘 If Nothing Works

### Nuclear Option - Fresh Start:
```bash
# Backup your .env files first!
rm -rf frontend/node_modules
rm -rf backend/node_modules
rm frontend/package-lock.json
rm backend/package-lock.json

# Reinstall everything
cd backend && npm install
cd ../frontend && npm install

# Start fresh
cd backend && npm run dev
# In new terminal:
cd frontend && npm run dev
```

## 📞 Quick Test Commands

### Test if everything is working:
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev

# Terminal 3 - Test
curl http://localhost:5000/health
curl http://localhost:3000
```

If you're still having issues after trying these steps, the problem might be:
1. Antivirus software blocking connections
2. Corporate firewall/proxy
3. Windows network adapter issues
4. Node.js version compatibility

Let me know which step resolves the issue!