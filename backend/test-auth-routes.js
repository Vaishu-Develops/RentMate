// Simple test to load auth routes
try {
  console.log('Testing auth routes import...')
  const authRoutes = require('./routes/auth.js')
  console.log('✅ Auth routes loaded successfully')
  console.log('Routes object type:', typeof authRoutes)
} catch (error) {
  console.log('❌ Error loading auth routes:')
  console.log('Error message:', error.message)
  console.log('Error stack:', error.stack)
}
