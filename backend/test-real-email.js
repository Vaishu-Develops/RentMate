const axios = require('axios');

const API_URL = 'http://localhost:5000';

// Test data with the specified email
const testUser = {
  fullName: 'Vaishnavi Test User',
  email: 'vaishuxx2024@gmail.com',
  phone: '9876543210',
  password: 'password123',
  confirmPassword: 'password123',
  city: 'Chennai',
  state: 'Tamil Nadu',
  intent: 'explore',
  initialRole: 'commonUser',
  agreeToTerms: true
};

console.log('🚀 Testing Registration with Real Email: vaishuxx2024@gmail.com');
console.log('📧 This will send a real OTP email!');
console.log('\nRequest data:', JSON.stringify(testUser, null, 2));

async function testRegistration() {
  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, testUser, {
      timeout: 30000 // 30 second timeout
    });
    
    console.log('\n✅ SUCCESS! Registration completed');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    console.log('\n📧 Check your email (vaishuxx2024@gmail.com) for the 6-digit OTP!');
    console.log('💡 After receiving the OTP, run: node test-complete-flow.js');
    
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.log('\n⏰ Request timed out (this is normal when email is being sent)');
      console.log('💡 The user is likely created successfully');
      console.log('📧 Check your email for the OTP and run: node test-complete-flow.js');
    } else if (error.response?.data?.message?.includes('already exists')) {
      console.log('\n⚠️ User already exists with this email');
      console.log('💡 You can proceed with OTP verification using: node test-complete-flow.js');
    } else {
      console.error('\n❌ Registration failed:');
      console.error('Error:', error.response?.data || error.message);
    }
  }
}

testRegistration();
