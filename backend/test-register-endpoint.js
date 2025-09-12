const axios = require('axios');

// Define the base URL for the API
const API_URL = 'http://localhost:5000/api';

// Test data for registration
const testUser = {
  fullName: 'Test User',
  email: 'test@example.com',
  phone: '9876543210',
  password: 'password123',
  confirmPassword: 'password123',
  city: 'Chennai',
  state: 'Tamil Nadu',
  intent: 'explore',
  initialRole: 'commonUser',
  agreeToTerms: true
};

// Function to test if an endpoint exists (without sending data)
async function checkEndpointExists(url) {
  try {
    console.log(`Checking if endpoint exists: ${url}`);
    // Use OPTIONS request to check if endpoint exists
    await axios.options(url);
    console.log('✅ Endpoint exists');
    return true;
  } catch (error) {
    if (error.response) {
      // Even a 404 or 405 response means the server is running
      console.log(`❌ Endpoint check received response status: ${error.response.status}`);
      return error.response.status !== 404; // Return true if status is not 404
    }
    console.error('❌ Endpoint check failed:', error.message);
    return false;
  }
}

// Function to test the register endpoint
async function testRegisterEndpoint() {
  try {
    // First check if endpoint exists
    const endpointExists = await checkEndpointExists(`${API_URL}/auth/register`);
    
    if (!endpointExists) {
      console.log('❌ /api/auth/register endpoint not found');
      // Try alternative endpoint (in case there's a mismatch)
      const altEndpointExists = await checkEndpointExists(`${API_URL}/auth`);
      if (altEndpointExists) {
        console.log('ℹ️ /api/auth endpoint exists, but /register is not available');
      }
      return;
    }
    
    console.log('Testing /api/auth/register endpoint...');
    console.log('Request data:', JSON.stringify(testUser, null, 2));
    
    const response = await axios.post(`${API_URL}/auth/register`, testUser);
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('Error:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    
    return null;
  }
}

// Function to check available routes
async function checkAvailableRoutes() {
  try {
    console.log('Checking available routes...');
    // Make a request to a path that doesn't exist to get the available routes
    const response = await axios.get(`${API_URL}/nonexistent-path`);
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.availableRoutes) {
      console.log('Available routes:', error.response.data.availableRoutes);
      return error.response.data.availableRoutes;
    }
    console.error('Failed to get available routes:', error.message);
    return null;
  }
}

// Run the tests
async function runTests() {
  try {
    // First check available routes
    await checkAvailableRoutes();
    
    // Then test the register endpoint
    await testRegisterEndpoint();
    
    console.log('All tests completed');
  } catch (err) {
    console.error('Tests failed:', err);
  }
}

runTests();
