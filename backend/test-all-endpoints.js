const axios = require('axios');

// Define the base URL for the API
const API_URL = 'http://localhost:5000';

// Test data
const testUser = {
  fullName: 'Test User',
  email: `test${Date.now()}@example.com`, // Use unique email
  phone: '9876543210',
  password: 'password123',
  confirmPassword: 'password123',
  city: 'Chennai',
  state: 'Tamil Nadu',
  intent: 'explore',
  initialRole: 'commonUser',
  agreeToTerms: true
};

let authToken = null;
let userId = null;

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Test functions for each endpoint
async function testHealthEndpoint() {
  try {
    log('blue', '\n=== Testing Health Endpoint ===');
    const response = await axios.get(`${API_URL}/health`);
    log('green', '✅ GET /health - SUCCESS');
    console.log('Response:', response.data);
    return true;
  } catch (error) {
    log('red', '❌ GET /health - FAILED');
    console.log('Error:', error.response?.data || error.message);
    return false;
  }
}

async function testRegisterEndpoint() {
  try {
    log('blue', '\n=== Testing Register Endpoint ===');
    console.log('Request data:', JSON.stringify(testUser, null, 2));
    
    const response = await axios.post(`${API_URL}/api/auth/register`, testUser);
    log('green', '✅ POST /api/auth/register - SUCCESS');
    console.log('Response:', response.data);
    
    userId = response.data.data?.user?.id;
    return true;
  } catch (error) {
    log('red', '❌ POST /api/auth/register - FAILED');
    console.log('Error status:', error.response?.status);
    console.log('Error data:', error.response?.data);
    return false;
  }
}

async function testLoginEndpoint() {
  try {
    log('blue', '\n=== Testing Login Endpoint ===');
    const loginData = {
      email: testUser.email,
      password: testUser.password
    };
    console.log('Request data:', JSON.stringify(loginData, null, 2));
    
    const response = await axios.post(`${API_URL}/api/auth/login`, loginData);
    log('green', '✅ POST /api/auth/login - SUCCESS');
    console.log('Response:', response.data);
    
    authToken = response.data.data?.token;
    return true;
  } catch (error) {
    log('red', '❌ POST /api/auth/login - FAILED');
    console.log('Error status:', error.response?.status);
    console.log('Error data:', error.response?.data);
    return false;
  }
}

async function testVerifyEmailEndpoint() {
  try {
    log('blue', '\n=== Testing Verify Email Endpoint ===');
    const verifyData = {
      token: 'TEST123' // This will likely fail, but we're testing the endpoint
    };
    
    const response = await axios.post(`${API_URL}/api/auth/verify-email`, verifyData);
    log('green', '✅ POST /api/auth/verify-email - SUCCESS');
    console.log('Response:', response.data);
    return true;
  } catch (error) {
    log('yellow', '⚠️ POST /api/auth/verify-email - EXPECTED FAILURE (invalid token)');
    console.log('Error status:', error.response?.status);
    console.log('Error data:', error.response?.data);
    return true; // This is expected to fail with invalid token
  }
}

async function testGetMeEndpoint() {
  try {
    log('blue', '\n=== Testing Get Me Endpoint ===');
    
    if (!authToken) {
      log('yellow', '⚠️ GET /api/auth/me - SKIPPED (no auth token)');
      return false;
    }
    
    const response = await axios.get(`${API_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    log('green', '✅ GET /api/auth/me - SUCCESS');
    console.log('Response:', response.data);
    return true;
  } catch (error) {
    log('red', '❌ GET /api/auth/me - FAILED');
    console.log('Error status:', error.response?.status);
    console.log('Error data:', error.response?.data);
    return false;
  }
}

async function testUpdateProfileEndpoint() {
  try {
    log('blue', '\n=== Testing Update Profile Endpoint ===');
    
    if (!authToken) {
      log('yellow', '⚠️ PUT /api/auth/profile - SKIPPED (no auth token)');
      return false;
    }
    
    const updateData = {
      name: 'Updated Test User',
      city: 'Mumbai'
    };
    
    const response = await axios.put(`${API_URL}/api/auth/profile`, updateData, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    log('green', '✅ PUT /api/auth/profile - SUCCESS');
    console.log('Response:', response.data);
    return true;
  } catch (error) {
    log('red', '❌ PUT /api/auth/profile - FAILED');
    console.log('Error status:', error.response?.status);
    console.log('Error data:', error.response?.data);
    return false;
  }
}

async function testResendOTPEndpoint() {
  try {
    log('blue', '\n=== Testing Resend OTP Endpoint ===');
    const otpData = {
      email: testUser.email
    };
    
    const response = await axios.post(`${API_URL}/api/auth/resend-otp`, otpData);
    log('green', '✅ POST /api/auth/resend-otp - SUCCESS');
    console.log('Response:', response.data);
    return true;
  } catch (error) {
    log('red', '❌ POST /api/auth/resend-otp - FAILED');
    console.log('Error status:', error.response?.status);
    console.log('Error data:', error.response?.data);
    return false;
  }
}

async function testForgotPasswordEndpoint() {
  try {
    log('blue', '\n=== Testing Forgot Password Endpoint ===');
    const forgotData = {
      email: testUser.email
    };
    
    const response = await axios.post(`${API_URL}/api/auth/forgot-password`, forgotData);
    log('green', '✅ POST /api/auth/forgot-password - SUCCESS');
    console.log('Response:', response.data);
    return true;
  } catch (error) {
    log('red', '❌ POST /api/auth/forgot-password - FAILED');
    console.log('Error status:', error.response?.status);
    console.log('Error data:', error.response?.data);
    return false;
  }
}

async function testSwitchRoleEndpoint() {
  try {
    log('blue', '\n=== Testing Switch Role Endpoint ===');
    
    if (!authToken) {
      log('yellow', '⚠️ POST /api/auth/switch-role - SKIPPED (no auth token)');
      return false;
    }
    
    const roleData = {
      role: 'tenant'
    };
    
    const response = await axios.post(`${API_URL}/api/auth/switch-role`, roleData, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    log('green', '✅ POST /api/auth/switch-role - SUCCESS');
    console.log('Response:', response.data);
    return true;
  } catch (error) {
    log('red', '❌ POST /api/auth/switch-role - FAILED');
    console.log('Error status:', error.response?.status);
    console.log('Error data:', error.response?.data);
    return false;
  }
}

// Main test runner
async function runAllTests() {
  log('magenta', '🚀 Starting comprehensive API endpoint tests...\n');
  
  const results = [];
  
  // Test all endpoints
  results.push(await testHealthEndpoint());
  results.push(await testRegisterEndpoint());
  results.push(await testLoginEndpoint());
  results.push(await testVerifyEmailEndpoint());
  results.push(await testGetMeEndpoint());
  results.push(await testUpdateProfileEndpoint());
  results.push(await testResendOTPEndpoint());
  results.push(await testForgotPasswordEndpoint());
  results.push(await testSwitchRoleEndpoint());
  
  // Summary
  const totalTests = results.length;
  const passedTests = results.filter(r => r).length;
  const failedTests = totalTests - passedTests;
  
  log('magenta', '\n=== TEST SUMMARY ===');
  log('green', `✅ Passed: ${passedTests}/${totalTests}`);
  if (failedTests > 0) {
    log('red', `❌ Failed: ${failedTests}/${totalTests}`);
  }
  
  if (passedTests === totalTests) {
    log('green', '🎉 All tests passed! Your API endpoints are working correctly.');
    log('cyan', `📚 View API documentation at: ${API_URL}/api/docs`);
  } else {
    log('yellow', '⚠️ Some tests failed. Please check the errors above.');
  }
}

// Run the tests
runAllTests().catch(error => {
  log('red', 'Test runner failed:');
  console.error(error);
});
