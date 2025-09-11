const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  personalInfo: {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number']
    },
    dateOfBirth: {
      type: Date
    },
    profilePicture: {
      type: String // Cloudinary URL
    },
    aadhaarNumber: {
      type: String,
      match: [/^\d{12}$/, 'Please enter a valid Aadhaar number']
    },
    panNumber: {
      type: String,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter a valid PAN number']
    }
  },
  
  // Progressive Role Detection System
  roles: [{
    type: String,
    enum: ['commonUser', 'tenant', 'landlord', 'admin'],
    default: 'commonUser'
  }],
  activeRole: {
    type: String,
    enum: ['commonUser', 'tenant', 'landlord', 'admin'],
    default: 'commonUser'
  },
  
  // Role-specific data
  roleData: {
    landlord: {
      properties: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
      }],
      totalProperties: {
        type: Number,
        default: 0
      },
      verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
      },
      businessDetails: {
        businessName: String,
        businessAddress: String,
        gstNumber: String,
        bankDetails: {
          accountNumber: String,
          ifscCode: String,
          accountHolderName: String,
          bankName: String
        }
      },
      rating: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
      }
    },
    tenant: {
      currentProperty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
      },
      currentLease: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lease'
      },
      rentalHistory: [{
        property: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Property'
        },
        lease: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Lease'
        },
        startDate: Date,
        endDate: Date,
        monthlyRent: Number,
        rating: Number
      }],
      creditScore: {
        type: Number,
        default: 750,
        min: 300,
        max: 900
      },
      preferences: {
        maxBudget: Number,
        preferredLocations: [String],
        bhkPreference: [String],
        amenityPreferences: [String],
        occupancyType: {
          type: String,
          enum: ['family', 'bachelor', 'any'],
          default: 'any'
        }
      },
      employmentDetails: {
        occupation: String,
        company: String,
        monthlyIncome: Number,
        workExperience: Number,
        employmentType: {
          type: String,
          enum: ['permanent', 'contract', 'freelance', 'business']
        }
      }
    }
  },
  
  location: {
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    coordinates: {
      type: [Number] // [longitude, latitude]
    }
  },
  
  // Account status and verification
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Verification tokens
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // Login tracking
  lastLogin: Date,
  loginCount: {
    type: Number,
    default: 0
  },
  
  // Preferences and settings
  preferences: {
    language: {
      type: String,
      enum: ['en', 'hi', 'ta', 'te', 'kn'],
      default: 'en'
    },
    currency: {
      type: String,
      default: 'INR'
    },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false }
    },
    privacy: {
      showPhone: { type: Boolean, default: true },
      showEmail: { type: Boolean, default: false },
      profileVisibility: {
        type: String,
        enum: ['public', 'private', 'contacts'],
        default: 'public'
      }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes for better performance (email already has unique index)
userSchema.index({ 'personalInfo.phone': 1 })
userSchema.index({ roles: 1 })
userSchema.index({ 'location.city': 1 })
userSchema.index({ 'location.coordinates': '2dsphere' })
userSchema.index({ createdAt: -1 })

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.personalInfo.name
})

// Virtual for landlord properties count
userSchema.virtual('propertiesCount').get(function() {
  return this.roleData?.landlord?.totalProperties || 0
})

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next()
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Instance method to check password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Instance method to add role
userSchema.methods.addRole = function(role) {
  if (!this.roles.includes(role)) {
    this.roles.push(role)
    
    // Initialize role data if not exists
    if (role === 'landlord' && !this.roleData.landlord) {
      this.roleData.landlord = {
        properties: [],
        totalProperties: 0,
        verificationStatus: 'pending',
        businessDetails: {},
        rating: { average: 0, count: 0 }
      }
    }
    
    if (role === 'tenant' && !this.roleData.tenant) {
      this.roleData.tenant = {
        rentalHistory: [],
        creditScore: 750,
        preferences: {},
        employmentDetails: {}
      }
    }
  }
  return this
}

// Instance method to switch active role
userSchema.methods.switchRole = function(role) {
  if (this.roles.includes(role)) {
    this.activeRole = role
  }
  return this
}

// Instance method to check if user has role
userSchema.methods.hasRole = function(role) {
  return this.roles.includes(role)
}

// Static method to find users by role
userSchema.statics.findByRole = function(role) {
  return this.find({ roles: role })
}

// Static method to find landlords in a city
userSchema.statics.findLandlordsInCity = function(city) {
  return this.find({
    roles: 'landlord',
    'location.city': new RegExp(city, 'i')
  })
}

module.exports = mongoose.model('User', userSchema)