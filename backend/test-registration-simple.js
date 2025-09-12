const axios = require('axios');
require('dotenv').config();

async function testRegistrationWithOTP() {
  console.log('🚀 Testing Registration with Console OTP Display\n');
  
  const BASE_URL = 'http://localhost:5000/api';
  
  try {
    // Test server connection
    console.log('🔍 Testing server connection...');
    try {
      const healthCheck = await axios.get(`${BASE_URL}/health`);
      console.log('✅ Server is running');
    } catch (error) {
      console.log('❌ Server connection failed. Make sure backend is running on port 5000');
      return;
    }
    
    // Clear any existing test user
    console.log('\n🧹 Cleaning up any existing test user...');
    const { MongoClient } = require('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db('rentmate');
    
    await db.collection('users').deleteOne({ email: 'vaishuxx2024@gmail.com' });
    console.log('✅ Cleanup completed');
    
    // Register new user
    console.log('\n📝 Registering new user...');
    const registerData = {
      name: 'Test User',
      email: 'vaishuxx2024@gmail.com',
      password: 'TestPass123!',
      confirmPassword: 'TestPass123!',
      phone: '+919876543210',
      agreeToTerms: true
    };
    
    console.log('📤 Sending registration request...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, registerData);
    
    console.log('✅ Registration response:', registerResponse.data.message);
    
    // Check console for OTP (it should be displayed above)
    console.log('\n🔍 Checking database for generated OTP...');
    const user = await db.collection('users').findOne({ email: 'vaishuxx2024@gmail.com' });
    
    if (user && user.emailVerificationToken) {
      const otp = user.emailVerificationToken.substring(0, 6).toUpperCase();
      console.log('\n🎯 OTP FOUND IN DATABASE:', otp);
      console.log('⏰ Expires at:', new Date(user.emailVerificationExpires));
      console.log('📧 Email verified:', user.emailVerified);
      
      // Verify OTP
      console.log('\n🔐 Verifying OTP...');
      const verifyResponse = await axios.post(`${BASE_URL}/auth/verify-email`, {
        email: 'vaishuxx2024@gmail.com',
        otp: otp
      });
      
      console.log('✅ OTP verification successful!');
      console.log('🔑 JWT Token received:', !!verifyResponse.data.token);
      
      // Test authenticated request
      console.log('\n🛡️ Testing authenticated request...');
      const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${verifyResponse.data.token}`
        }
      });
      
      console.log('✅ Profile access successful!');
      console.log('👤 User name:', profileResponse.data.user.name);
      console.log('📧 Email verified:', profileResponse.data.user.emailVerified);
      
      // Test login with verified account
      console.log('\n🔑 Testing login...');
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: 'vaishuxx2024@gmail.com',
        password: 'TestPass123!'
      });
      
      console.log('✅ Login successful!');
      console.log('🎯 New token received:', !!loginResponse.data.token);
      
      console.log('\n🎉 COMPLETE FLOW TEST SUCCESSFUL!');
      console.log('✅ Registration → OTP Generation → OTP Verification → Authentication → Login');
      
    } else {
      console.log('❌ No OTP found in database');
      console.log('User exists:', !!user);
      if (user) {
        console.log('User data:', {
          email: user.email,
          emailVerified: user.emailVerified,
          hasOTP: !!user.emailVerificationToken
        });
      }
    }
    
    await client.close();
    
  } catch (error) {
    console.error('\n❌ Test failed:');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    
    if (error.response?.status === 400) {
      console.log('\n💡 Common issues:');
      console.log('• User already exists');
      console.log('• Invalid request data');
      console.log('• OTP expired');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Server not running on port 5000');
    }
  }
}

testRegistrationWithOTP();
