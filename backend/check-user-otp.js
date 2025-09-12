const mongoose = require('mongoose')
const User = require('./models/User')
require('dotenv').config()

async function checkUsers() {
  try {
    console.log('🔗 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')
    
    // Find users with vaishu email
    const users = await User.find({
      email: { $regex: /vaishu/i }
    })
    
    console.log(`\n📋 Found ${users.length} users with 'vaishu' in email:`)
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. User Details:`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Name: ${user.personalInfo?.name || 'Not set'}`)
      console.log(`   Phone: ${user.personalInfo?.phone || user.phone || 'Not set'}`)
      console.log(`   Email Verified: ${user.isEmailVerified}`)
      console.log(`   Created: ${user.createdAt}`)
      
      if (user.emailVerificationToken) {
        const sixDigitOTP = user.emailVerificationToken.substring(0, 6).toUpperCase()
        console.log(`   🔑 6-Digit OTP: ${sixDigitOTP}`)
        console.log(`   📅 OTP Expires: ${user.emailVerificationExpires ? new Date(user.emailVerificationExpires) : 'No expiration'}`)
        
        // Check if OTP is still valid
        if (user.emailVerificationExpires && user.emailVerificationExpires > Date.now()) {
          console.log(`   ✅ OTP is still VALID`)
        } else {
          console.log(`   ❌ OTP is EXPIRED`)
        }
      } else {
        console.log(`   ⚠️ No OTP token found`)
      }
      
      console.log(`   🆔 User ID: ${user._id}`)
      console.log('   ---')
    })
    
    if (users.length === 0) {
      console.log('   No users found with "vaishu" in email')
      console.log('   💡 Run the registration first to create a user')
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await mongoose.disconnect()
    console.log('\n🔌 Disconnected from MongoDB')
    process.exit(0)
  }
}

checkUsers()
