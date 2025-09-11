# 🚀 RentMate Quick Start Guide

Get RentMate up and running in 5 minutes!

## Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- Git

## 1. Clone & Setup

```bash
git clone <your-repo-url>
cd rentmate-platform
npm run setup
```

## 2. Configure Environment

Edit `server/.env`:

```env
# Required - Add your values
MONGODB_URI=mongodb://localhost:27017/rentmate
GEMINI_API_KEY=your-gemini-api-key-here
JWT_SECRET=your-super-secret-jwt-key-make-it-long

# Email (Optional for testing)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 3. Start Development

```bash
npm run dev
```

## 4. Open Your Browser

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000/health

## 🎯 Test the Features

### 1. Registration Flow
1. Go to http://localhost:3000
2. Click "Create Account"
3. Select "I want to list my property" 
4. Complete registration
5. Notice automatic landlord role assignment!

### 2. AI Features
1. Try listing a property
2. Watch AI generate property description
3. Test tenant application screening

### 3. Progressive Roles
1. Register as property seeker
2. Apply for a rental → automatically get tenant role
3. List a property → automatically get landlord role
4. Switch between roles seamlessly

## 🔧 Quick Configuration

### Get Gemini API Key (Free)
1. Visit: https://makersuite.google.com/app/apikey
2. Create new API key
3. Add to `server/.env`

### MongoDB Setup
**Option A - Local:**
```bash
# Install MongoDB locally
mongod --dbpath /path/to/data
```

**Option B - Atlas (Recommended):**
1. Create free MongoDB Atlas account
2. Create cluster
3. Get connection string
4. Add to `server/.env`

## 🎨 UI Components Available

- **Aurora Background** - Animated homepage background
- **3D Property Cards** - Interactive property listings  
- **Floating Navigation** - Modern navigation dock
- **Progressive Forms** - Smart multi-step forms

## 🤖 AI Features Ready

- Property description generation
- Tenant application screening
- Lease agreement creation
- Legal clause explanation

## 📱 Mobile Ready

- Responsive design
- Touch-optimized interfaces
- Mobile-first approach

## 🔒 Security Features

- JWT authentication
- Password hashing
- Rate limiting
- Input validation
- CORS protection

## 🚨 Troubleshooting

### Common Issues:

**Port already in use:**
```bash
# Kill processes on ports
npx kill-port 3000 5000
```

**MongoDB connection failed:**
- Check MongoDB is running
- Verify connection string
- Check network access (Atlas)

**Missing dependencies:**
```bash
npm run install-all
```

**Environment variables:**
- Copy `.env.example` to `.env`
- Add required values
- Restart servers

## 📞 Need Help?

- Check the full README.md
- Open an issue on GitHub
- Contact: support@rentmate.com

---

**You're all set! 🎉 Welcome to RentMate!**