const mongoose = require('mongoose')
const winston = require('winston')

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
})

const connectDB = async () => {
  try {
    console.log('🔄 Connecting to database...')
    
    const mongoURI = process.env.NODE_ENV === 'production' 
      ? process.env.MONGODB_URI_PROD 
      : process.env.MONGODB_URI

    // Check if using Atlas or local
    if (mongoURI && !mongoURI.includes('localhost')) {
      console.log('☁️ Using MongoDB Atlas')
    } else {
      console.log('📍 Using local MongoDB')
    }

    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false // Disable mongoose buffering
    })

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    console.log(`📊 Database: ${conn.connection.name}`)
    logger.info(`MongoDB Connected: ${conn.connection.host}`)

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected')
    })

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected')
    })

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close()
        logger.info('MongoDB connection closed through app termination')
        process.exit(0)
      } catch (err) {
        logger.error('Error during MongoDB disconnection:', err)
        process.exit(1)
      }
    })

  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:', error.message)
    
    // Try local MongoDB as fallback in development
    if (process.env.NODE_ENV === 'development') {
      try {
        console.log('🔄 Trying local MongoDB as fallback...')
        const localConn = await mongoose.connect('mongodb://localhost:27017/rentmate', {
          serverSelectionTimeoutMS: 2000
        })
        
        console.log(`✅ Local MongoDB Connected: ${localConn.connection.host}`)
        console.log(`📊 Database: ${localConn.connection.name}`)
        return
      } catch (localError) {
        console.log('❌ Local MongoDB also failed:', localError.message)
      }
    }
    
    logger.error('Database connection failed:', error)
    
    if (error.message.includes('IP') && error.message.includes('whitelist')) {
      console.log('\n🔒 IP WHITELIST ISSUE DETECTED!')
      console.log('📋 To fix this:')
      console.log('1. Go to https://cloud.mongodb.com')
      console.log('2. Navigate to Network Access')
      console.log('3. Click "Add IP Address"')
      console.log('4. Click "Add Current IP Address"')
      console.log('5. Or add 0.0.0.0/0 for development (allows all IPs)')
      console.log('')
    }
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 MongoDB is not running. Options:')
      console.log('1. Install and start MongoDB locally')
      console.log('2. Use MongoDB Atlas (cloud)')
      console.log('3. Update MONGODB_URI in .env file')
    }
    
    // Don't exit in development, let the app run without DB for now
    if (process.env.NODE_ENV !== 'production') {
      console.log('⚠️ Running without database connection (development mode)')
      console.log('🚀 Server will still start, but database features will not work')
      return
    }
    
    process.exit(1)
  }
}

module.exports = connectDB