const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../models/User')
const { protect, rateLimitSensitive } = require('../middleware/auth')
const { sendEmail } = require('../utils/email')
const { validateRegistration, validateLogin } = require('../utils/validation')

const router = express.Router()

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  })
}

// Generate Refresh Token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d'
  })
}

// @desc    Register user with progressive role detection
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    console.log('📝 Registration request received:')
    console.log('Body:', req.body)
    
    const { error } = validateRegistration(req.body)
    if (error) {
      console.log('❌ Validation error:', error.details[0].message)
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      })
    }

    const {
      fullName,
      email,
      phone,
      password,
      city,
      state,
      intent,
      initialRole
    } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { 'personalInfo.phone': phone }]
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or phone number'
      })
    }

    // Determine initial roles based on intent
    let roles = ['commonUser']
    let activeRole = 'commonUser'

    if (intent === 'list' && initialRole === 'landlord') {
      roles.push('landlord')
      activeRole = 'landlord'
    }

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex')
    const emailVerificationExpires = Date.now() + 1 * 60 * 1000 // 1 minute

    // Create user
    const user = await User.create({
      email,
      password,
      personalInfo: {
        name: fullName,
        phone
      },
      roles,
      activeRole,
      location: {
        city,
        state: state || 'Tamil Nadu' // Default to Tamil Nadu for MVP
      },
      emailVerificationToken,
      emailVerificationExpires
    })

    // Initialize role data based on initial role
    if (activeRole === 'landlord') {
      user.roleData.landlord = {
        properties: [],
        totalProperties: 0,
        verificationStatus: 'pending',
        businessDetails: {},
        rating: { average: 0, count: 0 }
      }
      await user.save()
    }

    // Send verification email
    try {
      const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${emailVerificationToken}`
      
      await sendEmail({
        email: user.email,
        subject: 'RentMate - Verify Your Email Address',
        templateName: 'emailVerification',
        templateData: {
          fullName: user.personalInfo.name,
          verificationUrl,
          verificationCode: emailVerificationToken.substring(0, 6).toUpperCase()
        }
      })
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Don't fail registration if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email for verification.',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.personalInfo.name,
          roles: user.roles,
          activeRole: user.activeRole,
          isEmailVerified: user.isEmailVerified
        }
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    })
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { error } = validateLogin(req.body)
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      })
    }

    const { email, password, rememberMe } = req.body

    // Check for user and include password
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      })
    }

    // Update login tracking
    user.lastLogin = new Date()
    user.loginCount += 1
    await user.save()

    // Generate tokens
    const token = generateToken(user._id)
    const refreshToken = generateRefreshToken(user._id)

    // Set token expiry based on remember me
    const tokenExpiry = rememberMe ? '30d' : '7d'

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.personalInfo.name,
          phone: user.personalInfo.phone,
          profilePicture: user.personalInfo.profilePicture,
          roles: user.roles,
          activeRole: user.activeRole,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          location: user.location,
          preferences: user.preferences
        },
        token,
        refreshToken,
        expiresIn: tokenExpiry
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    })
  }
}

// @desc    Verify email address
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      })
    }

    console.log('🔍 Verification attempt with token:', token)

    let user;

    // Check if it's a 6-character OTP (user entered from email)
    if (token.length === 6) {
      console.log('📱 6-character OTP verification attempt')
      // Find user with emailVerificationToken that starts with this 6-character code
      const users = await User.find({
        emailVerificationExpires: { $gt: Date.now() }
      })
      
      user = users.find(u => 
        u.emailVerificationToken && 
        u.emailVerificationToken.substring(0, 6).toUpperCase() === token.toUpperCase()
      )
    } else {
      console.log('🔗 Full token verification attempt')
      // Find user with matching full token and check expiry
      user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: Date.now() }
      })
    }

    if (!user) {
      console.log('❌ No valid user found for token:', token)
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      })
    }

    console.log('✅ User found, verifying email for:', user.email)

    // Mark email as verified
    user.isEmailVerified = true
    user.emailVerificationToken = undefined
    user.emailVerificationExpires = undefined
    await user.save()

    // Generate login token
    const loginToken = generateToken(user._id)

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.personalInfo.name,
          roles: user.roles,
          activeRole: user.activeRole,
          isEmailVerified: user.isEmailVerified
        },
        token: loginToken
      }
    })
  } catch (error) {
    console.error('Email verification error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during email verification'
    })
  }
}

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.personalInfo.name,
          phone: user.personalInfo.phone,
          profilePicture: user.personalInfo.profilePicture,
          roles: user.roles,
          activeRole: user.activeRole,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          location: user.location,
          preferences: user.preferences,
          roleData: user.roleData
        }
      }
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      dateOfBirth,
      city,
      state,
      preferences,
      employmentDetails
    } = req.body

    const user = await User.findById(req.user.id)

    // Update personal info
    if (name) user.personalInfo.name = name
    if (phone) user.personalInfo.phone = phone
    if (dateOfBirth) user.personalInfo.dateOfBirth = dateOfBirth

    // Update location
    if (city) user.location.city = city
    if (state) user.location.state = state

    // Update preferences
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences }
    }

    // Update employment details for tenants
    if (employmentDetails && user.hasRole('tenant')) {
      user.roleData.tenant.employmentDetails = {
        ...user.roleData.tenant.employmentDetails,
        ...employmentDetails
      }
    }

    await user.save()

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.personalInfo.name,
          phone: user.personalInfo.phone,
          roles: user.roles,
          activeRole: user.activeRole,
          location: user.location,
          preferences: user.preferences
        }
      }
    })
  } catch (error) {
    console.error('Profile update error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during profile update'
    })
  }
}

// @desc    Switch active role
// @route   POST /api/auth/switch-role
// @access  Private
const switchRole = async (req, res) => {
  try {
    const { role } = req.body

    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Role is required'
      })
    }

    const user = await User.findById(req.user.id)

    if (!user.hasRole(role)) {
      return res.status(400).json({
        success: false,
        message: 'You do not have access to this role'
      })
    }

    user.switchRole(role)
    await user.save()

    res.status(200).json({
      success: true,
      message: `Switched to ${role} role successfully`,
      data: {
        activeRole: user.activeRole,
        availableRoles: user.roles
      }
    })
  } catch (error) {
    console.error('Role switch error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during role switch'
    })
  }
}

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with this email address'
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    user.passwordResetToken = resetToken
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000 // 10 minutes

    await user.save()

    // Send reset email
    try {
      const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`
      
      await sendEmail({
        to: user.email,
        subject: 'RentMate - Password Reset Request',
        template: 'passwordReset',
        data: {
          name: user.personalInfo.name,
          resetUrl,
          resetToken
        }
      })

      res.status(200).json({
        success: true,
        message: 'Password reset email sent'
      })
    } catch (emailError) {
      user.passwordResetToken = undefined
      user.passwordResetExpires = undefined
      await user.save()

      return res.status(500).json({
        success: false,
        message: 'Email could not be sent'
      })
    }
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and password are required'
      })
    }

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      })
    }

    // Set new password
    user.password = password
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Password reset successful'
    })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Resend email verification OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      })
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Check if user is already verified
    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      })
    }

    // Generate new verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex')
    user.emailVerificationToken = emailVerificationToken
    user.emailVerificationExpires = Date.now() + 1 * 60 * 1000 // 1 minute
    await user.save()

    // Send verification email
    try {
      const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${emailVerificationToken}`
      
      await sendEmail({
        email: user.email,
        subject: 'RentMate - Email Verification (Resent)',
        templateName: 'emailVerification',
        templateData: {
          fullName: user.fullName,
          verificationUrl,
          verificationCode: emailVerificationToken.substring(0, 6).toUpperCase()
        }
      })

      res.status(200).json({
        success: true,
        message: 'Verification email sent successfully'
      })
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      
      // Clear the verification token if email fails
      user.emailVerificationToken = undefined
      user.emailVerificationExpires = undefined
      await user.save()

      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again.'
      })
    }
  } catch (error) {
    console.error('Resend OTP error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    })
  }
}

// Routes - Rate limiting disabled in development
if (process.env.NODE_ENV === 'production') {
  router.post('/register', rateLimitSensitive, register)
  router.post('/login', rateLimitSensitive, login)
  router.post('/resend-otp', rateLimitSensitive, resendOTP)
  router.post('/forgot-password', rateLimitSensitive, forgotPassword)
  router.post('/reset-password', rateLimitSensitive, resetPassword)
} else {
  console.log('🚫 Auth rate limiting disabled in development mode')
  router.post('/register', register)
  router.post('/login', login)
  router.post('/resend-otp', resendOTP)
  router.post('/forgot-password', forgotPassword)
  router.post('/reset-password', resetPassword)
}
router.post('/verify-email', verifyEmail)
router.get('/me', protect, getMe)
router.put('/profile', protect, updateProfile)
router.post('/switch-role', protect, switchRole)

module.exports = router