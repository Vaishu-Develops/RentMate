// Enhanced test script that handles all registration scenarios
const axios = require('axios');

const API_URL = 'http://localhost:5000';

// Generate unique test data
const timestamp = Date.now();
const testUser = {
  fullName: 'Test User ' + timestamp,
  email: `test${timestamp}@example.com`,
  phone: `98765${Math.floor(Math.random() * 90000) + 10000}`, // Generate random phone
  password: 'password123',
  confirmPassword: 'password123',
  city: 'Chennai',
  state: 'Tamil Nadu',
  intent: 'explore',
  initialRole: 'commonUser',
  agreeToTerms: true
};

console.log('🚀 Testing Registration Flow with Fresh Data');
console.log('Test User Data:', JSON.stringify(testUser, null, 2));

async function testRegistrationFlow() {
  try {
    console.log('\n📝 Step 1: Testing Registration...');
    
    const registerResponse = await axios.post(`${API_URL}/api/auth/register`, testUser, {
      timeout: 10000 // 10 second timeout
    });
    
    console.log('✅ Registration Successful!');
    console.log('Response:', JSON.stringify(registerResponse.data, null, 2));
    
    if (registerResponse.data.success) {
      console.log('\n✨ User created successfully in database!');
      
      // Test login
      console.log('\n🔐 Step 2: Testing Login...');
      const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      
      console.log('✅ Login Successful!');
      console.log('Login Response:', JSON.stringify(loginResponse.data, null, 2));
      
      if (loginResponse.data.data && loginResponse.data.data.token) {
        const token = loginResponse.data.data.token;
        
        // Test protected endpoint
        console.log('\n👤 Step 3: Testing Protected Endpoint (/api/auth/me)...');
        const meResponse = await axios.get(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('✅ Protected Endpoint Works!');
        console.log('User Data:', JSON.stringify(meResponse.data, null, 2));
        
        console.log('\n🎉 All tests passed! Your API is working correctly with MongoDB Atlas!');
        
        // Summary
        console.log('\n📊 Test Summary:');
        console.log('✅ User Registration - SUCCESS');
        console.log('✅ Data Saved to MongoDB Atlas - SUCCESS');
        console.log('✅ User Login - SUCCESS');
        console.log('✅ JWT Authentication - SUCCESS');
        console.log('✅ Protected Endpoints - SUCCESS');
        
        return true;
      }
    }
    
  } catch (error) {
    console.error('\n❌ Test Failed!');
    console.error('Error:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
    
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ Request timed out - this might be due to email sending delay');
      console.error('💡 Try disabling email sending in development or increasing timeout');
    }
    
    return false;
  }
}

testRegistrationFlow();
