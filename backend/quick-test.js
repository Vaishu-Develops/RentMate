// Quick test without email delays
const axios = require('axios');

const API_URL = 'http://localhost:5000';

// Simple test data
const testUser = {
  fullName: 'Quick Test User',
  email: `quicktest${Date.now()}@example.com`,
  phone: `98765${Math.floor(Math.random() * 90000) + 10000}`,
  password: 'password123',
  confirmPassword: 'password123',
  city: 'Chennai',
  state: 'Tamil Nadu',
  intent: 'explore',
  initialRole: 'commonUser',
  agreeToTerms: true
};

console.log('🚀 Quick Registration Test');
console.log('Data:', JSON.stringify(testUser, null, 2));

async function quickTest() {
  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, testUser, {
      timeout: 5000 // 5 second timeout
    });
    
    console.log('✅ SUCCESS! Registration completed');
    console.log('Response:', response.data);
    
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.log('⏰ Request timed out, but this might mean registration is processing...');
      console.log('💡 Check the database to see if user was created');
    } else {
      console.error('❌ Error:', error.response?.data || error.message);
    }
  }
}

quickTest();
