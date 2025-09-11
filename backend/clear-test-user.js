// Script to clear test user for development
// Run this in MongoDB shell or create a route to clear test data

const mongoose = require('mongoose')
require('dotenv').config()

async function clearTestUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    
    const User = mongoose.model('User', {
      email: String,
      phone: String
    })
    
    // Remove user with test email or phone
    const result = await User.deleteMany({
      $or: [
        { email: 'vaishnavisudarsanam11@gmail.com' },
        { phone: '9150219313' }
      ]
    })
    
    console.log('Deleted users:', result.deletedCount)
    process.exit(0)
    
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

clearTestUser()
