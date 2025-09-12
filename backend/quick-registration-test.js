const axios = require('axios');
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function quickRegistrationTest() {
  console.log('🚀 Quick Registration Test with OTP\n');
  
  const BASE_URL = 'http://localhost:5000';
  
  try {
    // Test server
    console.log('🔍 Testing server...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server response:', health.data);
    
    // Clear existing user
    console.log('\n🧹 Clearing test user...');
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db('rentmate');
    await db.collection('users').deleteOne({ email: 'vaishuxx2024@gmail.com' });
    console.log('✅ User cleared');
    
    // Register user
    console.log('\n📝 Registering user...');
    const registerData = {
      name: 'Test User',
      email: 'vaishuxx2024@gmail.com',
      password: 'TestPass123!',
      confirmPassword: 'TestPass123!',
      phone: '+919876543210',
      agreeToTerms: true
    };
    
    console.log('📤 Sending registration request...');
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, registerData);
    console.log('✅ Registration successful:', registerResponse.data.message);
    
    // Get OTP from database
    console.log('\n🔍 Retrieving OTP from database...');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second for DB update
    
    const user = await db.collection('users').findOne({ email: 'vaishuxx2024@gmail.com' });
    if (user && user.emailVerificationToken) {
      const otp = user.emailVerificationToken.substring(0, 6).toUpperCase();
      console.log('\n🎯 OTP RETRIEVED:', otp);
      console.log('⏰ Expires:', new Date(user.emailVerificationExpires));
      
      // Verify OTP
      console.log('\n🔐 Verifying OTP...');
      const verifyResponse = await axios.post(`${BASE_URL}/api/auth/verify-email`, {
        email: 'vaishuxx2024@gmail.com',
        otp: otp
      });
      
      console.log('✅ OTP verification successful!');
      console.log('🔑 JWT Token received');
      
      // Test protected endpoint
      console.log('\n🛡️ Testing protected endpoint...');
      const profileResponse = await axios.get(`${BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${verifyResponse.data.token}`
        }
      });
      
      console.log('✅ Protected endpoint access successful!');
      console.log('👤 User:', profileResponse.data.user.name);
      console.log('📧 Email verified:', profileResponse.data.user.emailVerified);
      
      console.log('\n🎉 COMPLETE FLOW SUCCESSFUL!');
      console.log('✅ Registration → OTP Generation → OTP Verification → JWT → Protected Access');
      
    } else {
      console.log('❌ No OTP found in database');
    }
    
    await client.close();
    
  } catch (error) {
    console.error('\n❌ Test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run the test
quickRegistrationTest().then(() => {
  console.log('\n✨ Test completed!');
  process.exit(0);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
