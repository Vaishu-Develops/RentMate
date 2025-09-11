const mongoose = require('mongoose')

const propertySchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Property owner is required'],
    index: true
  },
  
  basicInfo: {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Property description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    aiGeneratedDescription: {
      type: String,
      maxlength: [2000, 'AI description cannot exceed 2000 characters']
    },
    type: {
      type: String,
      required: [true, 'Property type is required'],
      enum: ['apartment', 'house', 'villa', 'studio', 'pg', 'hostel', 'commercial']
    },
    bhkType: {
      type: String,
      required: [true, 'BHK type is required'],
      enum: ['1rk', '1bhk', '2bhk', '3bhk', '4bhk', '4bhk+', 'studio']
    }
  },
  
  location: {
    fullAddress: {
      type: String,
      required: [true, 'Full address is required'],
      maxlength: [500, 'Address cannot exceed 500 characters']
    },
    area: {
      type: String,
      required: [true, 'Area/Locality is required'],
      index: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      index: true
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      match: [/^\d{6}$/, 'Please enter a valid pincode']
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, 'Coordinates are required'],
      index: '2dsphere'
    },
    nearbyLandmarks: [String],
    commutability: {
      nearestMetro: {
        name: String,
        distance: Number // in km
      },
      nearestBusStop: {
        name: String,
        distance: Number // in km
      },
      nearestRailway: {
        name: String,
        distance: Number // in km
      },
      majorHubs: [{
        name: String,
        distance: Number, // in km
        travelTime: Number // in minutes
      }]
    }
  },
  
  propertyDetails: {
    builtUpArea: {
      type: Number,
      required: [true, 'Built-up area is required'],
      min: [50, 'Built-up area must be at least 50 sqft']
    },
    carpetArea: {
      type: Number,
      required: [true, 'Carpet area is required'],
      min: [30, 'Carpet area must be at least 30 sqft']
    },
    floor: {
      type: Number,
      required: [true, 'Floor number is required'],
      min: [0, 'Floor cannot be negative']
    },
    totalFloors: {
      type: Number,
      required: [true, 'Total floors is required'],
      min: [1, 'Total floors must be at least 1']
    },
    furnishingStatus: {
      type: String,
      required: [true, 'Furnishing status is required'],
      enum: ['fully_furnished', 'semi_furnished', 'unfurnished']
    },
    parking: {
      available: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        enum: ['covered', 'open', 'both'],
        required: function() { return this.parking.available }
      },
      count: {
        type: Number,
        default: 0,
        min: 0
      }
    },
    balconies: {
      type: Number,
      default: 0,
      min: 0
    },
    bathrooms: {
      type: Number,
      required: [true, 'Number of bathrooms is required'],
      min: [1, 'Must have at least 1 bathroom']
    },
    facingDirection: {
      type: String,
      enum: ['north', 'south', 'east', 'west', 'north_east', 'north_west', 'south_east', 'south_west']
    },
    ageOfProperty: {
      type: Number, // in years
      min: 0
    },
    floorPlan: String // Cloudinary URL
  },
  
  amenities: {
    basic: [{
      type: String,
      enum: [
        'power_backup', 'water_supply', 'security', 'elevator', 'parking',
        'garden', 'balcony', 'terrace', 'store_room', 'servant_room'
      ]
    }],
    premium: [{
      type: String,
      enum: [
        'gym', 'swimming_pool', 'clubhouse', 'playground', 'jogging_track',
        'tennis_court', 'badminton_court', 'community_hall', 'library',
        'spa', 'salon', 'shopping_center', 'restaurant'
      ]
    }],
    connectivity: [{
      type: String,
      enum: ['wifi', 'cable_tv', 'intercom', 'video_door_phone', 'cctv']
    }],
    appliances: [{
      type: String,
      enum: [
        'ac', 'geyser', 'refrigerator', 'washing_machine', 'microwave',
        'dishwasher', 'tv', 'sofa', 'bed', 'wardrobe', 'dining_table'
      ]
    }]
  },
  
  pricing: {
    monthlyRent: {
      type: Number,
      required: [true, 'Monthly rent is required'],
      min: [1000, 'Monthly rent must be at least ₹1000']
    },
    securityDeposit: {
      type: Number,
      required: [true, 'Security deposit is required'],
      min: [0, 'Security deposit cannot be negative']
    },
    maintenanceCharges: {
      type: Number,
      default: 0,
      min: [0, 'Maintenance charges cannot be negative']
    },
    brokerageType: {
      type: String,
      required: [true, 'Brokerage type is required'],
      enum: ['owner_direct', 'brokerage']
    },
    brokerageAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    negotiable: {
      type: Boolean,
      default: false
    },
    priceHistory: [{
      rent: Number,
      deposit: Number,
      maintenance: Number,
      changedAt: {
        type: Date,
        default: Date.now
      },
      reason: String
    }]
  },
  
  media: {
    images: [{
      url: String, // Cloudinary URL
      caption: String,
      isPrimary: {
        type: Boolean,
        default: false
      }
    }],
    videos: [{
      url: String, // Cloudinary URL
      caption: String,
      duration: Number // in seconds
    }],
    virtualTour: String, // 360-degree tour link
    documents: [{
      type: String,
      url: String, // Cloudinary URL
      name: String
    }]
  },
  
  availability: {
    status: {
      type: String,
      required: [true, 'Availability status is required'],
      enum: ['available', 'occupied', 'maintenance', 'rented'],
      default: 'available',
      index: true
    },
    availableFrom: {
      type: Date,
      default: Date.now
    },
    tenantPreferences: {
      occupantType: {
        type: String,
        enum: ['family', 'bachelor', 'any'],
        default: 'any'
      },
      dietaryPreference: {
        type: String,
        enum: ['veg', 'non_veg', 'any'],
        default: 'any'
      },
      petPolicy: {
        type: String,
        enum: ['allowed', 'not_allowed', 'conditional'],
        default: 'not_allowed'
      },
      smokingPolicy: {
        type: String,
        enum: ['allowed', 'not_allowed'],
        default: 'not_allowed'
      },
      genderPreference: {
        type: String,
        enum: ['male', 'female', 'any'],
        default: 'any'
      }
    },
    restrictions: [String]
  },
  
  currentTenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  analytics: {
    totalViews: {
      type: Number,
      default: 0
    },
    uniqueViews: {
      type: Number,
      default: 0
    },
    inquiries: {
      type: Number,
      default: 0
    },
    applications: {
      type: Number,
      default: 0
    },
    averageResponseTime: {
      type: Number, // in hours
      default: 0
    },
    lastViewedAt: Date,
    viewHistory: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      viewedAt: {
        type: Date,
        default: Date.now
      },
      source: String // web, mobile, api
    }]
  },
  
  verification: {
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
      index: true
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verificationDate: Date,
    verificationNotes: String,
    documents: [{
      type: String,
      enum: ['ownership_proof', 'identity_proof', 'address_proof', 'noc'],
      url: String,
      status: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
      }
    }]
  },
  
  // SEO and Search Optimization
  searchTags: [String],
  seoTitle: String,
  seoDescription: String,
  
  // Status and Management
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  
  // Ratings and Reviews
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes for better performance
propertySchema.index({ ownerId: 1 })
propertySchema.index({ 'location.city': 1, 'location.area': 1 })
propertySchema.index({ 'location.coordinates': '2dsphere' })
propertySchema.index({ 'pricing.monthlyRent': 1 })
propertySchema.index({ 'basicInfo.bhkType': 1 })
propertySchema.index({ 'availability.status': 1 })
propertySchema.index({ 'verification.status': 1 })
propertySchema.index({ isActive: 1, isFeatured: 1 })
propertySchema.index({ createdAt: -1 })

// Compound indexes for common queries
propertySchema.index({ 
  'location.city': 1, 
  'availability.status': 1, 
  'pricing.monthlyRent': 1 
})
propertySchema.index({ 
  'location.area': 1, 
  'basicInfo.bhkType': 1, 
  'pricing.monthlyRent': 1 
})

// Virtual for rent per sqft
propertySchema.virtual('rentPerSqft').get(function() {
  if (this.propertyDetails.carpetArea && this.pricing.monthlyRent) {
    return Math.round(this.pricing.monthlyRent / this.propertyDetails.carpetArea)
  }
  return 0
})

// Virtual for total monthly cost
propertySchema.virtual('totalMonthlyCost').get(function() {
  return this.pricing.monthlyRent + (this.pricing.maintenanceCharges || 0)
})

// Virtual for primary image
propertySchema.virtual('primaryImage').get(function() {
  const primaryImg = this.media.images.find(img => img.isPrimary)
  return primaryImg ? primaryImg.url : (this.media.images[0]?.url || null)
})

// Pre-save middleware
propertySchema.pre('save', function(next) {
  // Ensure at least one image is marked as primary
  if (this.media.images.length > 0) {
    const hasPrimary = this.media.images.some(img => img.isPrimary)
    if (!hasPrimary) {
      this.media.images[0].isPrimary = true
    }
  }
  
  // Generate search tags
  this.searchTags = [
    this.location.area.toLowerCase(),
    this.location.city.toLowerCase(),
    this.basicInfo.bhkType.toLowerCase(),
    this.basicInfo.type.toLowerCase(),
    ...this.amenities.basic.map(a => a.toLowerCase()),
    ...this.amenities.premium.map(a => a.toLowerCase())
  ]
  
  next()
})

// Static method to find properties by filters
propertySchema.statics.findByFilters = function(filters) {
  const query = { isActive: true, 'availability.status': 'available' }
  
  if (filters.city) {
    query['location.city'] = new RegExp(filters.city, 'i')
  }
  
  if (filters.area) {
    query['location.area'] = new RegExp(filters.area, 'i')
  }
  
  if (filters.bhkType) {
    query['basicInfo.bhkType'] = filters.bhkType
  }
  
  if (filters.minRent || filters.maxRent) {
    query['pricing.monthlyRent'] = {}
    if (filters.minRent) query['pricing.monthlyRent'].$gte = filters.minRent
    if (filters.maxRent) query['pricing.monthlyRent'].$lte = filters.maxRent
  }
  
  if (filters.propertyType) {
    query['basicInfo.type'] = filters.propertyType
  }
  
  if (filters.furnishing) {
    query['propertyDetails.furnishingStatus'] = filters.furnishing
  }
  
  return this.find(query)
}

// Static method to find nearby properties
propertySchema.statics.findNearby = function(longitude, latitude, maxDistance = 5000) {
  return this.find({
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance
      }
    },
    isActive: true,
    'availability.status': 'available'
  })
}

// Instance method to increment view count
propertySchema.methods.incrementView = function(userId = null, source = 'web') {
  this.analytics.totalViews += 1
  this.analytics.lastViewedAt = new Date()
  
  if (userId) {
    // Check if this user has viewed before
    const existingView = this.analytics.viewHistory.find(
      view => view.userId && view.userId.toString() === userId.toString()
    )
    
    if (!existingView) {
      this.analytics.uniqueViews += 1
      this.analytics.viewHistory.push({
        userId,
        viewedAt: new Date(),
        source
      })
    }
  }
  
  return this.save()
}

module.exports = mongoose.model('Property', propertySchema)