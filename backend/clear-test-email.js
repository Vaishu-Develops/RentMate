const mongoose = require('mongoose')
const User = require('./models/User')
require('dotenv').config()

async function clearTestEmail() {
  try {
    console.log('🔗 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')
    
    // Remove user with specific email
    const result = await User.deleteMany({
      email: 'vaishuxx2024@gmail.com'
    })
    
    console.log(`🗑️ Removed ${result.deletedCount} users with email: vaishuxx2024@gmail.com`)
    
    // Check if there are any remaining users with similar emails
    const similarUsers = await User.find({
      email: { $regex: /vaishu/i }
    }, { email: 1, createdAt: 1 })
    
    console.log('\n📋 Users with similar emails:')
    if (similarUsers.length === 0) {
      console.log('  No similar users found')
    } else {
      similarUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email} (Created: ${user.createdAt})`)
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

clearTestEmail()
