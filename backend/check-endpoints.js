const axios = require('axios');

const API_URL = 'http://localhost:5000';

// List of all endpoints to check
const endpoints = [
  { method: 'GET', path: '/health', description: 'Health check' },
  { method: 'GET', path: '/api', description: 'API welcome' },
  { method: 'POST', path: '/api/auth/register', description: 'User registration' },
  { method: 'POST', path: '/api/auth/login', description: 'User login' },
  { method: 'POST', path: '/api/auth/verify-email', description: 'Email verification' },
  { method: 'POST', path: '/api/auth/resend-otp', description: 'Resend OTP' },
  { method: 'POST', path: '/api/auth/forgot-password', description: 'Forgot password' },
  { method: 'POST', path: '/api/auth/reset-password', description: 'Reset password' },
  { method: 'GET', path: '/api/auth/me', description: 'Get current user (requires auth)' },
  { method: 'PUT', path: '/api/auth/profile', description: 'Update profile (requires auth)' },
  { method: 'POST', path: '/api/auth/switch-role', description: 'Switch user role (requires auth)' }
];

async function checkEndpoint(endpoint) {
  try {
    if (endpoint.method === 'GET') {
      await axios.get(`${API_URL}${endpoint.path}`);
    } else {
      // For non-GET methods, use OPTIONS to check if endpoint exists
      await axios.options(`${API_URL}${endpoint.path}`);
    }
    return { ...endpoint, status: 'Available', color: '\x1b[32m' }; // Green
  } catch (error) {
    if (error.response && error.response.status !== 404) {
      // Endpoint exists but may require auth or data
      return { ...endpoint, status: 'Available (requires data/auth)', color: '\x1b[33m' }; // Yellow
    } else {
      return { ...endpoint, status: 'Not Found', color: '\x1b[31m' }; // Red
    }
  }
}

async function checkAllEndpoints() {
  console.log('\x1b[36m%s\x1b[0m', '🔍 Checking all API endpoints...\n');
  
  const results = [];
  
  for (const endpoint of endpoints) {
    const result = await checkEndpoint(endpoint);
    results.push(result);
    
    console.log(
      `${result.color}${result.status === 'Available' ? '✅' : result.status === 'Not Found' ? '❌' : '⚠️'} ${result.method.padEnd(6)} ${result.path.padEnd(30)} - ${result.status}\x1b[0m`
    );
  }
  
  console.log('\n\x1b[36m%s\x1b[0m', '📊 Summary:');
  const available = results.filter(r => r.status.includes('Available')).length;
  const notFound = results.filter(r => r.status === 'Not Found').length;
  
  console.log(`\x1b[32m✅ Available: ${available}/${results.length}\x1b[0m`);
  if (notFound > 0) {
    console.log(`\x1b[31m❌ Not Found: ${notFound}/${results.length}\x1b[0m`);
  }
  
  console.log('\n\x1b[36m%s\x1b[0m', '📚 API Documentation:');
  console.log(`\x1b[34m🔗 Swagger UI: ${API_URL}/api/docs\x1b[0m`);
  
  if (available === results.length) {
    console.log('\n\x1b[32m%s\x1b[0m', '🎉 All endpoints are accessible!');
  }
}

checkAllEndpoints().catch(console.error);
