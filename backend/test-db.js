const mongoose = require('mongoose')

// Simple MongoDB connection test
const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...')
    
    // Try to connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/rentmate', {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false
    })
    
    console.log('✅ MongoDB connection successful!')
    console.log('Database:', mongoose.connection.name)
    console.log('Host:', mongoose.connection.host)
    console.log('Port:', mongoose.connection.port)
    
    // Close connection
    await mongoose.connection.close()
    console.log('Connection closed.')
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:')
    console.error('Error:', error.message)
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Solutions:')
      console.log('1. Install MongoDB: https://www.mongodb.com/try/download/community')
      console.log('2. Start MongoDB service:')
      console.log('   - Windows: net start MongoDB')
      console.log('   - Mac: brew services start mongodb-community')
      console.log('   - Linux: sudo systemctl start mongod')
      console.log('3. Or use MongoDB Atlas (cloud): https://cloud.mongodb.com')
    }
  }
}

testConnection()