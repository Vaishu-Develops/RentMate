const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const dotenv = require('dotenv')
const connectDB = require('./config/database')

// Load environment variables
dotenv.config()

// Connect to database
connectDB()

const app = express()

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.gemini.com", "https://generativelanguage.googleapis.com"]
    }
  }
}))

// CORS configuration - Permissive for development with proxy
const corsOptions = {
  origin: function (origin, callback) {
    // In development, allow all localhost origins and no origin (proxy)
    if (process.env.NODE_ENV === 'development') {
      callback(null, true)
      return
    }
    
    const allowedOrigins = [
      process.env.CLIENT_URL,
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
      'https://rentmate.vercel.app'
    ]
    
    // Allow requests with no origin (mobile apps, proxy, etc.)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

// Compression middleware
app.use(compression())

// Rate limiting - Disabled in development
if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
  })

  app.use('/api/', limiter)
} else {
  console.log('🚫 Rate limiting disabled in development mode')
}

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    req.rawBody = buf
  }
}))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`)
  next()
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'RentMate API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  })
})

// API Routes
try {
  const authRoutes = require('./routes/auth')
  app.use('/api/auth', authRoutes)
  console.log('✅ Auth routes loaded successfully')
  
  // Debug: List all registered routes
  console.log('📋 Registered routes:')
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      console.log(`  ${Object.keys(middleware.route.methods)} ${middleware.route.path}`)
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          console.log(`  ${Object.keys(handler.route.methods)} /api/auth${handler.route.path}`)
        }
      })
    }
  })
} catch (error) {
  console.error('❌ Error loading auth routes:', error.message)
}
// app.use('/api/properties', require('./routes/properties'))
// app.use('/api/applications', require('./routes/applications'))
// app.use('/api/payments', require('./routes/payments'))
// app.use('/api/maintenance', require('./routes/maintenance'))
// app.use('/api/leases', require('./routes/leases'))
// app.use('/api/ai', require('./routes/ai'))
// app.use('/api/upload', require('./routes/upload'))

// Test route for debugging
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working',
    timestamp: new Date().toISOString()
  })
})

// Welcome route
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to RentMate API',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      auth: '/api/auth',
      properties: '/api/properties',
      applications: '/api/applications',
      payments: '/api/payments',
      maintenance: '/api/maintenance',
      leases: '/api/leases',
      ai: '/api/ai',
      upload: '/api/upload'
    }
  })
})

// Catch-all route handler for undefined routes
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: {
      health: '/health',
      api: '/api',
      auth: '/api/auth'
    }
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message)
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    })
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    })
  }

  // CORS error
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation'
    })
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  })
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...')
  server.close(() => {
    console.log('Process terminated')
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...')
  server.close(() => {
    console.log('Process terminated')
  })
})

// Start server
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
  console.log(`
🚀 RentMate API Server is running!
📍 Environment: ${process.env.NODE_ENV || 'development'}
🌐 Port: ${PORT}
🔗 URL: http://localhost:${PORT}
📚 Health Check: http://localhost:${PORT}/health
📋 API Docs: http://localhost:${PORT}/api

🏠 RentMate - Smart Rental Management Platform
   India's first comprehensive rental ecosystem with AI-powered features
  `)
})

module.exports = app