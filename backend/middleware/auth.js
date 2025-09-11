const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  try {
    let token

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      })
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      
      // Get user from token
      const user = await User.findById(decoded.id).select('-password')
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'No user found with this token'
        })
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'User account is deactivated'
        })
      }

      req.user = user
      next()
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    })
  }
}

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      })
    }

    // Check if user has any of the required roles
    const hasRole = roles.some(role => req.user.roles.includes(role))
    
    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.activeRole}' is not authorized to access this route`
      })
    }

    next()
  }
}

// Check if user has specific role (for progressive role detection)
const hasRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      })
    }

    if (!req.user.roles.includes(role)) {
      // Auto-add role based on action (progressive role detection)
      req.user.addRole(role)
      req.user.save()
    }

    next()
  }
}

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id).select('-password')
        
        if (user && user.isActive) {
          req.user = user
        }
      } catch (error) {
        // Token invalid, but continue without user
        req.user = null
      }
    }

    next()
  } catch (error) {
    next()
  }
}

// Check email verification
const requireEmailVerification = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Please verify your email address to access this feature'
    })
  }
  next()
}

// Rate limiting for sensitive operations
const rateLimitSensitive = (req, res, next) => {
  // This would typically use Redis or similar for production
  // For now, we'll implement a simple in-memory rate limiter
  
  const key = `${req.ip}_${req.user?.id || 'anonymous'}`
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxAttempts = 5

  if (!req.app.locals.rateLimitStore) {
    req.app.locals.rateLimitStore = new Map()
  }

  const store = req.app.locals.rateLimitStore
  const userAttempts = store.get(key) || { count: 0, resetTime: now + windowMs }

  if (now > userAttempts.resetTime) {
    userAttempts.count = 0
    userAttempts.resetTime = now + windowMs
  }

  if (userAttempts.count >= maxAttempts) {
    return res.status(429).json({
      success: false,
      message: 'Too many attempts. Please try again later.',
      retryAfter: Math.ceil((userAttempts.resetTime - now) / 1000)
    })
  }

  userAttempts.count++
  store.set(key, userAttempts)
  
  next()
}

module.exports = {
  protect,
  authorize,
  hasRole,
  optionalAuth,
  requireEmailVerification,
  rateLimitSensitive
}