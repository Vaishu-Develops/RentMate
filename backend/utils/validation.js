const Joi = require('joi')

// User Registration Validation
const validateRegistration = (data) => {
  const schema = Joi.object({
    fullName: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 100 characters',
        'any.required': 'Full name is required'
      }),
    
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required'
      }),
    
    phone: Joi.string()
      .pattern(/^[6-9]\d{9}$/)
      .required()
      .messages({
        'string.pattern.base': 'Please enter a valid Indian phone number',
        'any.required': 'Phone number is required'
      }),
    
    password: Joi.string()
      .min(6)
      .max(128)
      .required()
      .messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.max': 'Password cannot exceed 128 characters',
        'any.required': 'Password is required'
      }),
    
    confirmPassword: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Please confirm your password'
      }),
    
    city: Joi.string()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.min': 'City must be at least 2 characters long',
        'any.required': 'City is required'
      }),
    
    state: Joi.string()
      .min(2)
      .max(50)
      .optional(),
    
    intent: Joi.string()
      .valid('search', 'list', 'explore')
      .required()
      .messages({
        'any.only': 'Invalid intent selected',
        'any.required': 'Intent is required'
      }),
    
    initialRole: Joi.string()
      .valid('commonUser', 'landlord')
      .optional(),
    
    agreeToTerms: Joi.boolean()
      .valid(true)
      .required()
      .messages({
        'any.only': 'You must agree to the terms and conditions',
        'any.required': 'You must agree to the terms and conditions'
      })
  })

  return schema.validate(data)
}

// User Login Validation
const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required'
      }),
    
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required'
      }),
    
    rememberMe: Joi.boolean().optional()
  })

  return schema.validate(data)
}

// Property Creation Validation
const validateProperty = (data) => {
  const schema = Joi.object({
    // Basic Info
    title: Joi.string()
      .min(10)
      .max(200)
      .required()
      .messages({
        'string.min': 'Title must be at least 10 characters long',
        'string.max': 'Title cannot exceed 200 characters',
        'any.required': 'Property title is required'
      }),
    
    description: Joi.string()
      .min(50)
      .max(2000)
      .required()
      .messages({
        'string.min': 'Description must be at least 50 characters long',
        'string.max': 'Description cannot exceed 2000 characters',
        'any.required': 'Property description is required'
      }),
    
    type: Joi.string()
      .valid('apartment', 'house', 'villa', 'studio', 'pg', 'hostel', 'commercial')
      .required()
      .messages({
        'any.only': 'Invalid property type',
        'any.required': 'Property type is required'
      }),
    
    bhkType: Joi.string()
      .valid('1rk', '1bhk', '2bhk', '3bhk', '4bhk', '4bhk+', 'studio')
      .required()
      .messages({
        'any.only': 'Invalid BHK type',
        'any.required': 'BHK type is required'
      }),

    // Location
    fullAddress: Joi.string()
      .min(10)
      .max(500)
      .required()
      .messages({
        'string.min': 'Address must be at least 10 characters long',
        'any.required': 'Full address is required'
      }),
    
    area: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'any.required': 'Area/Locality is required'
      }),
    
    city: Joi.string()
      .min(2)
      .max(50)
      .required()
      .messages({
        'any.required': 'City is required'
      }),
    
    state: Joi.string()
      .min(2)
      .max(50)
      .required()
      .messages({
        'any.required': 'State is required'
      }),
    
    pincode: Joi.string()
      .pattern(/^\d{6}$/)
      .required()
      .messages({
        'string.pattern.base': 'Please enter a valid 6-digit pincode',
        'any.required': 'Pincode is required'
      }),
    
    coordinates: Joi.array()
      .items(Joi.number())
      .length(2)
      .required()
      .messages({
        'array.length': 'Coordinates must contain longitude and latitude',
        'any.required': 'Property coordinates are required'
      }),

    // Property Details
    builtUpArea: Joi.number()
      .min(50)
      .max(50000)
      .required()
      .messages({
        'number.min': 'Built-up area must be at least 50 sqft',
        'number.max': 'Built-up area cannot exceed 50,000 sqft',
        'any.required': 'Built-up area is required'
      }),
    
    carpetArea: Joi.number()
      .min(30)
      .max(40000)
      .required()
      .messages({
        'number.min': 'Carpet area must be at least 30 sqft',
        'number.max': 'Carpet area cannot exceed 40,000 sqft',
        'any.required': 'Carpet area is required'
      }),
    
    floor: Joi.number()
      .min(0)
      .max(200)
      .required()
      .messages({
        'number.min': 'Floor cannot be negative',
        'any.required': 'Floor number is required'
      }),
    
    totalFloors: Joi.number()
      .min(1)
      .max(200)
      .required()
      .messages({
        'number.min': 'Total floors must be at least 1',
        'any.required': 'Total floors is required'
      }),
    
    furnishingStatus: Joi.string()
      .valid('fully_furnished', 'semi_furnished', 'unfurnished')
      .required()
      .messages({
        'any.only': 'Invalid furnishing status',
        'any.required': 'Furnishing status is required'
      }),
    
    bathrooms: Joi.number()
      .min(1)
      .max(20)
      .required()
      .messages({
        'number.min': 'Must have at least 1 bathroom',
        'any.required': 'Number of bathrooms is required'
      }),

    // Pricing
    monthlyRent: Joi.number()
      .min(1000)
      .max(10000000)
      .required()
      .messages({
        'number.min': 'Monthly rent must be at least ₹1,000',
        'number.max': 'Monthly rent cannot exceed ₹1,00,00,000',
        'any.required': 'Monthly rent is required'
      }),
    
    securityDeposit: Joi.number()
      .min(0)
      .max(50000000)
      .required()
      .messages({
        'number.min': 'Security deposit cannot be negative',
        'any.required': 'Security deposit is required'
      }),
    
    maintenanceCharges: Joi.number()
      .min(0)
      .max(1000000)
      .optional(),
    
    brokerageType: Joi.string()
      .valid('owner_direct', 'brokerage')
      .required()
      .messages({
        'any.only': 'Invalid brokerage type',
        'any.required': 'Brokerage type is required'
      }),

    // Optional fields
    balconies: Joi.number().min(0).max(20).optional(),
    parking: Joi.object({
      available: Joi.boolean().required(),
      type: Joi.string().valid('covered', 'open', 'both').optional(),
      count: Joi.number().min(0).max(50).optional()
    }).optional(),
    
    amenities: Joi.object({
      basic: Joi.array().items(Joi.string()).optional(),
      premium: Joi.array().items(Joi.string()).optional(),
      connectivity: Joi.array().items(Joi.string()).optional(),
      appliances: Joi.array().items(Joi.string()).optional()
    }).optional(),
    
    tenantPreferences: Joi.object({
      occupantType: Joi.string().valid('family', 'bachelor', 'any').optional(),
      dietaryPreference: Joi.string().valid('veg', 'non_veg', 'any').optional(),
      petPolicy: Joi.string().valid('allowed', 'not_allowed', 'conditional').optional(),
      smokingPolicy: Joi.string().valid('allowed', 'not_allowed').optional(),
      genderPreference: Joi.string().valid('male', 'female', 'any').optional()
    }).optional()
  })

  return schema.validate(data)
}

// Rental Application Validation
const validateApplication = (data) => {
  const schema = Joi.object({
    propertyId: Joi.string()
      .required()
      .messages({
        'any.required': 'Property ID is required'
      }),
    
    message: Joi.string()
      .min(10)
      .max(1000)
      .required()
      .messages({
        'string.min': 'Message must be at least 10 characters long',
        'string.max': 'Message cannot exceed 1000 characters',
        'any.required': 'Message to owner is required'
      }),
    
    moveInDate: Joi.date()
      .min('now')
      .required()
      .messages({
        'date.min': 'Move-in date cannot be in the past',
        'any.required': 'Preferred move-in date is required'
      }),
    
    leaseDuration: Joi.number()
      .min(1)
      .max(60)
      .required()
      .messages({
        'number.min': 'Lease duration must be at least 1 month',
        'number.max': 'Lease duration cannot exceed 60 months',
        'any.required': 'Lease duration is required'
      }),
    
    occupation: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'any.required': 'Occupation is required'
      }),
    
    company: Joi.string()
      .min(2)
      .max(200)
      .optional(),
    
    monthlyIncome: Joi.number()
      .min(10000)
      .max(100000000)
      .required()
      .messages({
        'number.min': 'Monthly income must be at least ₹10,000',
        'any.required': 'Monthly income is required'
      }),
    
    workExperience: Joi.number()
      .min(0)
      .max(50)
      .optional(),
    
    employmentType: Joi.string()
      .valid('permanent', 'contract', 'freelance', 'business')
      .optional(),
    
    previousRentals: Joi.array()
      .items(Joi.object({
        address: Joi.string().required(),
        duration: Joi.string().required(),
        landlordContact: Joi.string().optional(),
        reason: Joi.string().optional()
      }))
      .optional()
  })

  return schema.validate(data)
}

// Contact/Inquiry Validation
const validateInquiry = (data) => {
  const schema = Joi.object({
    propertyId: Joi.string()
      .required()
      .messages({
        'any.required': 'Property ID is required'
      }),
    
    message: Joi.string()
      .min(10)
      .max(500)
      .required()
      .messages({
        'string.min': 'Message must be at least 10 characters long',
        'string.max': 'Message cannot exceed 500 characters',
        'any.required': 'Message is required'
      }),
    
    inquiryType: Joi.string()
      .valid('general', 'viewing', 'pricing', 'availability', 'other')
      .required()
      .messages({
        'any.only': 'Invalid inquiry type',
        'any.required': 'Inquiry type is required'
      }),
    
    preferredContactTime: Joi.string()
      .valid('morning', 'afternoon', 'evening', 'anytime')
      .optional(),
    
    phoneNumber: Joi.string()
      .pattern(/^[6-9]\d{9}$/)
      .optional()
      .messages({
        'string.pattern.base': 'Please enter a valid Indian phone number'
      })
  })

  return schema.validate(data)
}

module.exports = {
  validateRegistration,
  validateLogin,
  validateProperty,
  validateApplication,
  validateInquiry
}