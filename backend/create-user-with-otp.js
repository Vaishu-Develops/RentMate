const mongoose = require('mongoose')
const User = require('./models/User')
require('dotenv').config()

async function registerUserAndShowOTP() {
  try {
    console.log('🔗 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')
    
    // Clear existing user first
    await User.deleteMany({ email: 'vaishuxx2024@gmail.com' })
    console.log('🗑️ Cleared existing user')
    
    // Create new user manually with OTP
    const crypto = require('crypto')
    const emailVerificationToken = crypto.randomBytes(32).toString('hex')
    const emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    
    const user = new User({
      email: 'vaishuxx2024@gmail.com',
      password: 'password123', // This will be hashed automatically
      personalInfo: {
        name: 'Vaishnavi Test User',
        phone: '9876543210'
      },
      roles: ['commonUser'],
      activeRole: 'commonUser',
      location: {
        city: 'Chennai',
        state: 'Tamil Nadu'
      },
      emailVerificationToken,
      emailVerificationExpires,
      isEmailVerified: false
    })
    
    await user.save()
    console.log('✅ User created successfully!')
    
    // Show the OTP in console
    const sixDigitOTP = emailVerificationToken.substring(0, 6).toUpperCase()
    
    console.log('\n🎉 SUCCESS! User registration completed')
    console.log('📧 Email: vaishuxx2024@gmail.com')
    console.log('🔑 Password: password123')
    console.log(`📱 Your 6-digit OTP is: ${sixDigitOTP}`)
    console.log(`🔗 Full token: ${emailVerificationToken}`)
    
    console.log('\n📋 User Details:')
    console.log(`ID: ${user._id}`)
    console.log(`Email: ${user.email}`)
    console.log(`Name: ${user.personalInfo.name}`)
    console.log(`Phone: ${user.personalInfo.phone}`)
    console.log(`Verified: ${user.isEmailVerified}`)
    
    console.log('\n🚀 Now you can test:')
    console.log('1. Login with email and password')
    console.log('2. Verify email with the 6-digit OTP')
    console.log('3. Test protected endpoints')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Disconnected from MongoDB')
    process.exit(0)
  }
}

registerUserAndShowOTP()
