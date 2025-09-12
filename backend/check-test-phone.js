const mongoose = require('mongoose')
const User = require('./models/User')
require('dotenv').config()

async function checkUsersWithTestPhone() {
  try {
    console.log('🔗 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')
    
    // Find users with test phone number
    const usersWithTestPhone = await User.find({
      $or: [
        { phone: '9876543210' },
        { 'personalInfo.phone': '9876543210' }
      ]
    })
    
    console.log(`Found ${usersWithTestPhone.length} users with test phone number:`)
    usersWithTestPhone.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`)
      console.log(`   Phone: ${user.phone || user.personalInfo?.phone}`)
      console.log(`   Created: ${user.createdAt}`)
      console.log(`   ID: ${user._id}`)
      console.log('---')
    })
    
    // Remove them
    const result = await User.deleteMany({
      $or: [
        { phone: '9876543210' },
        { 'personalInfo.phone': '9876543210' }
      ]
    })
    
    console.log(`🗑️ Removed ${result.deletedCount} users with test phone number`)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Disconnected from MongoDB')
    process.exit(0)
  }
}

checkUsersWithTestPhone()
