# RentMate Project Structure

This document outlines the organized project structure with clearly separated backend and frontend components.

## 📁 Project Organization

```
RentMate_Hackathon/
├── 🔧 Backend (rentmate-backend/)
├── 🎨 Frontend (rentmate-frontend/)
├── 📚 Legacy Files (client/, server/)
└── 📋 Documentation
```

## 🔧 Backend Structure (rentmate-backend/)

**Main Technologies:** Node.js, Express.js, MongoDB, JWT, AI Integration

```
rentmate-backend/
├── 📄 index.js                    # Main server entry point
├── 📄 package.json               # Backend dependencies
├── 📄 .env                       # Environment variables
├── 📄 .env.example              # Environment template
├── 📁 config/
│   └── database.js              # MongoDB connection
├── 📁 models/
│   ├── User.js                  # User schema with progressive roles
│   └── Property.js              # Property schema
├── 📁 routes/
│   └── auth.js                  # Authentication routes
├── 📁 middleware/
│   └── auth.js                  # JWT authentication middleware
├── 📁 services/
│   └── aiService.js             # AI/Gemini integration
└── 📁 utils/
    ├── email.js                 # Email service
    └── validation.js            # Input validation
```

### Backend Features:
- ✅ Express.js REST API
- ✅ MongoDB with Mongoose
- ✅ JWT Authentication
- ✅ Progressive Role System (commonUser → tenant/landlord)
- ✅ AI Integration (Gemini API)
- ✅ Email Services
- ✅ Input Validation
- ✅ Security Middleware (Helmet, CORS, Rate Limiting)
- ✅ Error Handling

### Backend API Endpoints:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/switch-role` - Switch active role

## 🎨 Frontend Structure (rentmate-frontend/)

**Main Technologies:** React, Vite, TailwindCSS, Framer Motion, Zustand

```
rentmate-frontend/
├── 📄 index.html                # HTML entry point
├── 📄 package.json             # Frontend dependencies
├── 📄 tailwind.config.js       # TailwindCSS configuration
├── 📄 .env                     # Frontend environment variables
├── 📄 .env.example            # Environment template
├── 📁 src/
│   ├── 📄 main.jsx            # React entry point
│   ├── 📄 App.jsx             # Main app component with routing
│   ├── 📄 index.css           # Global styles
│   ├── 📁 components/
│   │   ├── 📁 auth/
│   │   │   ├── LoginForm.jsx          # Login component
│   │   │   └── RegisterForm.jsx       # Registration component
│   │   ├── 📁 home/
│   │   │   └── HomePage.jsx           # Landing page
│   │   ├── 📁 navigation/
│   │   │   └── Navigation.jsx         # Navigation component
│   │   ├── 📁 property/
│   │   │   └── PropertyCard.jsx       # Property card component
│   │   └── 📁 ui/                     # Reusable UI components
│   │       ├── aurora-background.jsx
│   │       ├── aurora-background-demo.jsx
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── card-hover-effect.jsx
│   │       ├── hover-border-gradient.jsx
│   │       ├── input.jsx
│   │       └── resizable-navbar.jsx
│   ├── 📁 services/
│   │   └── api.js              # API service layer
│   ├── 📁 store/
│   │   └── authStore.js        # Zustand auth store
│   └── 📁 lib/
│       └── utils.js            # Utility functions
```

### Frontend Features:
- ✅ React 18 with Vite
- ✅ TailwindCSS for styling
- ✅ Framer Motion animations
- ✅ Zustand state management
- ✅ React Hook Form
- ✅ Axios API integration
- ✅ Progressive role-based UI
- ✅ Responsive design
- ✅ Modern UI components
- ✅ Authentication flow

### Frontend Pages:
- `/` - Landing page (different for authenticated/non-authenticated)
- `/login` - Login form
- `/register` - Multi-step registration
- `/dashboard` - User dashboard
- `/dashboard/landlord` - Landlord dashboard
- `/dashboard/tenant` - Tenant dashboard

## 🔄 Integration Points

### API Communication:
- Frontend uses Axios to communicate with backend
- JWT tokens stored in Zustand store
- Automatic token refresh and error handling
- Environment-based API URL configuration

### Authentication Flow:
1. User registers with intent selection
2. Email verification (optional)
3. Progressive role detection based on actions
4. Role-based UI and permissions

### State Management:
- Zustand for client-side state
- Persistent auth state in localStorage
- Progressive role system
- User permissions based on active role

## 🚀 Getting Started

### Backend Setup:
```bash
cd rentmate-backend
npm install
cp .env.example .env
# Configure environment variables
npm run dev
```

### Frontend Setup:
```bash
cd rentmate-frontend
npm install
cp .env.example .env
# Configure environment variables
npm run dev
```

### Environment Variables:

**Backend (.env):**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rentmate
JWT_SECRET=your-jwt-secret
GEMINI_API_KEY=your-gemini-api-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CLIENT_URL=http://localhost:3000
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=RentMate
```

## 📋 Legacy Files

The `client/` and `server/` directories contain the original project files and can be used for reference or removed after confirming the new structure works correctly.

## 🎯 Next Steps

1. **Complete Backend Routes:** Add property, application, payment routes
2. **Frontend Pages:** Implement dashboard, search, property listing pages
3. **Real-time Features:** Add WebSocket for messaging
4. **File Upload:** Implement image/document upload
5. **Payment Integration:** Add Razorpay integration
6. **Testing:** Add unit and integration tests
7. **Deployment:** Configure for production deployment

## 🔧 Development Commands

### Backend:
- `npm run dev` - Start development server
- `npm start` - Start production server
- `npm test` - Run tests

### Frontend:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

This structure provides clear separation of concerns, making the project easier to maintain, scale, and deploy.