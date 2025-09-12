const axios = require('axios');

const API_URL = 'http://localhost:5000';

// Test OTP verification directly
async function testOTPVerification() {
  console.log('🔐 Testing OTP Verification');
  console.log('📱 We\'ll test with some common test OTPs first');
  
  const testOTPs = ['123456', 'TEST12', 'ABCDEF']; // Common test OTPs
  
  for (const otp of testOTPs) {
    try {
      console.log(`\n🔍 Testing OTP: ${otp}`);
      
      const response = await axios.post(`${API_URL}/api/auth/verify-email`, {
        token: otp
      });
      
      console.log(`✅ OTP ${otp} worked!`);
      console.log('Response:', JSON.stringify(response.data, null, 2));
      return;
      
    } catch (error) {
      console.log(`❌ OTP ${otp} failed: ${error.response?.data?.message || error.message}`);
    }
  }
  
  console.log('\n💡 None of the test OTPs worked.');
  console.log('📧 Let\'s check if there\'s a user in the database with a valid OTP...');
  
  // If you have a specific OTP, you can test it here
  const userOTP = process.argv[2]; // Get OTP from command line argument
  
  if (userOTP) {
    try {
      console.log(`\n🔍 Testing your OTP: ${userOTP}`);
      
      const response = await axios.post(`${API_URL}/api/auth/verify-email`, {
        token: userOTP
      });
      
      console.log(`✅ Your OTP ${userOTP} worked!`);
      console.log('Response:', JSON.stringify(response.data, null, 2));
      
    } catch (error) {
      console.log(`❌ Your OTP ${userOTP} failed: ${error.response?.data?.message || error.message}`);
    }
  } else {
    console.log('\n💡 To test a specific OTP, run:');
    console.log('node test-otp-verification.js YOUR_OTP_HERE');
  }
}

testOTPVerification();
