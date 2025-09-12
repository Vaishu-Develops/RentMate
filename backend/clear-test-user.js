// Script to clear test users for development
const mongoose = require('mongoose')
const User = require('./models/User')
require('dotenv').config()

async function clearTestUsers() {
  try {
    console.log('🔗 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')
    
    // Remove users with test emails
    const result = await User.deleteMany({
      $or: [
        { email: { $regex: /^test.*@example\.com$/ } }, // Remove test emails
        { email: 'vaishnavisudarsanam11@gmail.com' },
        { phone: '9150219313' },
        { phone: '9876543210' } // Test phone number
      ]
    })
    
    console.log(`🗑️ Removed ${result.deletedCount} test users`)
    
    // List remaining users
    const remainingUsers = await User.find({}, { email: 1, phone: 1, createdAt: 1 }).limit(5)
    console.log('\n📋 Remaining users in database:')
    if (remainingUsers.length === 0) {
      console.log('  No users found in database')
    } else {
      remainingUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email} - ${user.phone} (Created: ${user.createdAt})`)
      })
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Disconnected from MongoDB')
    process.exit(0)
  }
}

clearTestUsers()
