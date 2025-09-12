// This script will examine your frontend and backend setup
// and determine why the /api/auth/register endpoint is not found

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Diagnosing RentMate API endpoint issues...');

// 1. Check if backend server is running
console.log('\n1️⃣ Checking if backend server is running...');
let isServerRunning = false;
try {
  // Try to make a request to the health endpoint
  execSync('curl -s http://localhost:5000/health');
  console.log('✅ Backend server is running');
  isServerRunning = true;
} catch (error) {
  console.log('❌ Backend server is not running');
  console.log('⚠️ Please start the backend server with:');
  console.log('cd backend && npm start');
}

// 2. Check auth.js routes file
console.log('\n2️⃣ Checking auth.js routes file...');
const authRoutesPath = path.join(__dirname, 'routes', 'auth.js');

if (fs.existsSync(authRoutesPath)) {
  console.log('✅ Auth routes file exists');
  
  // Read the file content
  const authRoutesContent = fs.readFileSync(authRoutesPath, 'utf8');
  
  // Check for register route
  if (authRoutesContent.includes('router.post(\'/register\'')) {
    console.log('✅ Register route is defined in auth.js');
  } else {
    console.log('❌ Register route is not defined in auth.js');
    console.log('⚠️ Please add the route definition:');
    console.log('router.post(\'/register\', register)');
  }
  
  // Check if router is exported
  if (authRoutesContent.includes('module.exports = router')) {
    console.log('✅ Router is exported correctly');
  } else {
    console.log('❌ Router is not exported correctly');
    console.log('⚠️ Please add at the end of the file:');
    console.log('module.exports = router');
  }
} else {
  console.log('❌ Auth routes file does not exist');
}

// 3. Check index.js mounting
console.log('\n3️⃣ Checking if routes are mounted correctly in index.js...');
const indexPath = path.join(__dirname, 'index.js');

if (fs.existsSync(indexPath)) {
  console.log('✅ index.js file exists');
  
  // Read the file content
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Check if auth routes are mounted
  if (indexContent.includes('app.use(\'/api/auth\'')) {
    console.log('✅ Auth routes are mounted correctly at /api/auth');
  } else {
    console.log('❌ Auth routes are not mounted correctly');
    console.log('⚠️ Please add the following code to index.js:');
    console.log('const authRoutes = require(\'./routes/auth\')');
    console.log('app.use(\'/api/auth\', authRoutes)');
  }
} else {
  console.log('❌ index.js file does not exist');
}

// 4. Check frontend API calls
console.log('\n4️⃣ Checking frontend API configuration...');
const apiPath = path.join(__dirname, '..', 'frontend', 'src', 'services', 'api.js');

if (fs.existsSync(apiPath)) {
  console.log('✅ Frontend API file exists');
  
  // Read the file content
  const apiContent = fs.readFileSync(apiPath, 'utf8');
  
  // Check baseURL configuration
  if (apiContent.includes('baseURL: API_BASE_URL')) {
    console.log('✅ API base URL is configured');
    
    // Check if API_BASE_URL is defined correctly
    const baseUrlMatch = apiContent.match(/const API_BASE_URL = ([^;]+)/);
    if (baseUrlMatch) {
      console.log('ℹ️ API_BASE_URL is defined as:', baseUrlMatch[1].trim());
    }
  } else {
    console.log('❌ API base URL is not configured correctly');
  }
  
  // Check register endpoint
  if (apiContent.includes('register: (userData) => api.post(\'/auth/register\'')) {
    console.log('✅ Register endpoint is defined in frontend API');
    console.log('⚠️ Note: If API_BASE_URL includes \'/api\', the actual path will be \'/api/auth/register\'');
    console.log('   If API_BASE_URL does NOT include \'/api\', the actual path will be \'/auth/register\'');
  } else {
    console.log('❌ Register endpoint is not defined correctly in frontend API');
  }
} else {
  console.log('❌ Frontend API file does not exist');
}

// 5. Solution recommendation
console.log('\n5️⃣ Solution recommendation:');

console.log('Based on the analysis, here are the likely solutions:');

console.log('\nSolution 1: Update frontend API calls to match backend routes');
console.log('In frontend/src/services/api.js, ensure paths are consistent with backend:');
console.log('If API_BASE_URL is \'/api\', use:');
console.log('register: (userData) => api.post(\'/auth/register\', userData)');
console.log('If API_BASE_URL is \'\', use:');
console.log('register: (userData) => api.post(\'/api/auth/register\', userData)');

console.log('\nSolution 2: Restart backend server');
console.log('Sometimes the server needs to be restarted after changes:');
console.log('1. Stop the current server (Ctrl+C)');
console.log('2. Start it again: cd backend && npm start');

console.log('\nSolution 3: Setup Swagger for API documentation');
console.log('Add Swagger to easily see and test all available endpoints:');
console.log('1. Make sure swagger-jsdoc and swagger-ui-express are installed');
console.log('2. Ensure swagger.js is properly configured');
console.log('3. Mount Swagger UI in index.js');
console.log('4. Access Swagger UI at http://localhost:5000/api/docs');

console.log('\n✨ End of diagnosis');
