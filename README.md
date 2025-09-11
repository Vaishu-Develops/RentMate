# RentMate - Complete Smart Rental Management Platform

![RentMate Logo](https://via.placeholder.com/800x200/3b82f6/ffffff?text=RentMate+-+Smart+Rental+Management)

## 🏠 Overview

RentMate is India's first comprehensive rental ecosystem that transforms the chaotic rental market into an organized, transparent, and efficient platform. Unlike existing solutions that focus on just property discovery, RentMate handles the complete rental lifecycle - from property search to lease termination.

### ✨ Key Features

- **🤖 AI-Powered Features**: Smart property descriptions, tenant screening, lease generation
- **🔄 Progressive Role Detection**: One account that grows with user needs
- **🇮🇳 India-Specific**: HRA receipts, regional compliance, local payment methods
- **📱 Mobile-First**: Optimized for smartphone-heavy user base
- **🔒 Complete Transparency**: All stakeholders see the same information

## 🚀 Technology Stack

### Frontend
- **React 18+** with Vite
- **Tailwind CSS** for styling
- **Shadcn/UI** components
- **Motion/Framer Motion** for animations
- **React Hook Form + Zod** for form handling
- **React Query** for server state management
- **Zustand** for client state management

### Backend
- **Node.js + Express.js**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **Gemini AI Integration**
- **Cloudinary** for file uploads
- **Nodemailer** for emails

### Key Libraries
- **motion** - Advanced animations
- **clsx + tailwind-merge** - Utility classes
- **@tabler/icons-react** - Icon library
- **bcryptjs** - Password hashing
- **joi** - Data validation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas)
- **Git**

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/rentmate-platform.git
cd rentmate-platform
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install all dependencies (client + server)
npm run install-all
```

### 3. Environment Configuration

#### Server Environment (.env)

Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

Configure the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/rentmate

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-complex
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-token-secret-also-long-and-complex
JWT_REFRESH_EXPIRE=30d

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Gemini AI Configuration
GEMINI_API_KEY=your-gemini-api-key-here

# Frontend URL
CLIENT_URL=http://localhost:3000
```

#### Client Environment (.env)

Create a `.env` file in the `client` directory:

```bash
cd client
touch .env
```

Add the following:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Database Setup

#### Option A: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. The application will create the database automatically

#### Option B: MongoDB Atlas (Recommended)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get the connection string
4. Update `MONGODB_URI` in server `.env`

### 5. External Service Setup

#### Gemini AI API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to `GEMINI_API_KEY` in server `.env`

#### Cloudinary Setup (Optional)

1. Create a [Cloudinary](https://cloudinary.com/) account
2. Get your cloud name, API key, and API secret
3. Add them to the server `.env` file

#### Email Setup (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an app password
3. Use your Gmail and app password in the `.env` file

## 🚀 Running the Application

### Development Mode

```bash
# Run both client and server concurrently
npm run dev

# Or run them separately:

# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client  
cd client
npm run dev
```

### Production Build

```bash
# Build client
cd client
npm run build

# Start server
cd server
npm start
```

## 📱 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health
- **API Documentation**: http://localhost:5000/api

## 🎯 Core Features Implementation

### 1. Progressive Role Detection System

Users start as `commonUser` and automatically get roles based on actions:

```javascript
// User applies for rental → gets 'tenant' role
// User lists property → gets 'landlord' role
// Seamless role switching in the same account
```

### 2. AI-Powered Features

- **Property Description Generation**: Auto-generates professional listings
- **Tenant Screening**: AI analyzes applications and provides recommendations
- **Lease Generation**: Creates custom lease agreements
- **Clause Explanation**: Simplifies legal terms for tenants

### 3. India-Specific Features

- **HRA Receipt Generation**: Automatic tax-compliant receipts
- **Regional Language Support**: Tamil, Hindi, Telugu, Kannada
- **Local Payment Methods**: UPI, Net Banking, Cards
- **Compliance**: Indian rental laws and regulations

## 🏗️ Project Structure

```
rentmate-platform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── ui/        # Shadcn/UI components
│   │   │   ├── auth/      # Authentication components
│   │   │   ├── home/      # Homepage components
│   │   │   ├── property/  # Property-related components
│   │   │   └── navigation/# Navigation components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── store/         # Zustand stores
│   │   ├── lib/           # Utility functions
│   │   └── styles/        # Global styles
│   ├── public/            # Static assets
│   └── package.json
├── server/                # Node.js backend
│   ├── config/           # Database and app config
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── services/         # Business logic services
│   ├── utils/            # Utility functions
│   └── package.json
├── package.json          # Root package.json
└── README.md
```

## 🔐 Authentication Flow

### Registration with Progressive Role Detection

1. **Intent Selection**: User selects their primary intent
2. **Basic Registration**: Email, password, basic info
3. **Email Verification**: 6-digit OTP verification
4. **Role Assignment**: Automatic role based on intent
5. **Progressive Enhancement**: Roles added based on actions

### Login & Role Management

- Single account, multiple roles
- Seamless role switching
- Role-specific dashboards and permissions

## 🎨 UI Components

### Aurora Background

```jsx
import { AuroraBackground } from '@/components/ui/aurora-background'

<AuroraBackground>
  <YourContent />
</AuroraBackground>
```

### 3D Property Cards

```jsx
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card'

<CardContainer>
  <CardBody>
    <CardItem translateZ="50">
      Property Title
    </CardItem>
  </CardBody>
</CardContainer>
```

### Floating Navigation

```jsx
import { FloatingDock } from '@/components/ui/floating-dock'

<FloatingDock items={navigationItems} />
```

## 🤖 AI Integration

### Gemini AI Service

```javascript
// Generate property description
const description = await aiService.generatePropertyDescription(propertyData)

// Screen tenant application
const screening = await aiService.screenTenant(applicationData)

// Generate lease clauses
const clauses = await aiService.generateLease(leaseData)
```

## 📊 Database Schema

### User Model (Progressive Roles)

```javascript
{
  email: String,
  password: String,
  personalInfo: { name, phone, profilePicture },
  roles: ['commonUser', 'tenant', 'landlord'], // Dynamic array
  activeRole: 'tenant', // Current session role
  roleData: {
    landlord: { properties, verification, businessDetails },
    tenant: { currentProperty, rentalHistory, preferences }
  }
}
```

### Property Model

```javascript
{
  ownerId: ObjectId,
  basicInfo: { title, description, aiGeneratedDescription, type, bhkType },
  location: { fullAddress, area, city, coordinates },
  propertyDetails: { area, floor, furnishing, amenities },
  pricing: { monthlyRent, deposit, maintenance },
  availability: { status, availableFrom, tenantPreferences },
  analytics: { views, inquiries, applications }
}
```

## 🚀 Deployment

### Frontend (Vercel)

```bash
cd client
npm run build
# Deploy to Vercel
```

### Backend (Railway/Heroku)

```bash
cd server
# Set environment variables
# Deploy to your preferred platform
```

### Database (MongoDB Atlas)

- Use MongoDB Atlas for production
- Set up proper indexes for performance
- Configure backup and monitoring

## 🧪 Testing

```bash
# Run client tests
cd client
npm test

# Run server tests
cd server
npm test
```

## 📈 Performance Optimization

- **Image Optimization**: Cloudinary auto-optimization
- **Lazy Loading**: Components and images
- **Code Splitting**: Route-based splitting
- **Caching**: API response caching
- **Database Indexing**: Optimized queries

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: API request limiting
- **CORS Protection**: Configured origins
- **Helmet.js**: Security headers
- **Input Validation**: Joi schema validation

## 🌍 Internationalization

- **Multi-language Support**: English, Hindi, Tamil, Telugu, Kannada
- **Currency Formatting**: Indian Rupee (₹)
- **Date Formatting**: Indian date formats
- **Regional Compliance**: State-specific rental laws

## 📞 Support & Contact

- **Email**: support@rentmate.com
- **Documentation**: [docs.rentmate.com](https://docs.rentmate.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/rentmate-platform/issues)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- **Shadcn/UI** for the beautiful component library
- **Tailwind CSS** for the utility-first CSS framework
- **Gemini AI** for AI-powered features
- **MongoDB** for the flexible database
- **Vercel** for seamless deployment

---

**RentMate** - Transforming India's rental market with AI-powered solutions 🏠✨