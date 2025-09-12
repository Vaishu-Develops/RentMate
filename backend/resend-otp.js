const axios = require('axios');

const API_URL = 'http://localhost:5000';

async function resendOTP() {
  try {
    console.log('📧 Requesting new OTP for vaishuxx2024@gmail.com...');
    
    const response = await axios.post(`${API_URL}/api/auth/resend-otp`, {
      email: 'vaishuxx2024@gmail.com'
    });
    
    console.log('✅ New OTP sent successfully!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    console.log('\n📱 Check your email for the new 6-digit OTP');
    console.log('💡 Then run: node test-complete-flow.js');
    
  } catch (error) {
    console.error('❌ Failed to resend OTP:');
    console.error('Error:', error.response?.data || error.message);
  }
}

resendOTP();
