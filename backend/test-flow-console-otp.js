const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const BASE_URL = 'http://localhost:5000/api';

async function testCompleteFlowWithConsoleOTP() {
  console.log('🚀 Testing Complete Registration Flow with Console OTP\n');
  
  try {
    // Step 1: Register user
    console.log('📝 Step 1: Registering user...');
    
    const registerData = {
      name: 'Test User',
      email: 'vaishuxx2024@gmail.com',
      password: 'TestPass123!',
      confirmPassword: 'TestPass123!',
      phone: '+919876543210',
      agreeToTerms: true
    };
    
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, registerData);
    console.log('✅ Registration successful:', registerResponse.data.message);
    
    if (registerResponse.data.tempToken) {
      console.log('🔑 Temp token received for OTP verification');
    }
    
    // Step 2: Check database for OTP (since email might not work)
    console.log('\n🔍 Step 2: Checking database for OTP...');
    
    const { MongoClient } = require('mongodb');
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://vaishnavisudarsanam11_db_user:RnUqsHOusQ0rmy25@cluster0.fzkfm6p.mongodb.net/rentmate?retryWrites=true&w=majority&appName=Cluster0';
    
    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db('rentmate');
    
    const user = await db.collection('users').findOne({ email: 'vaishuxx2024@gmail.com' });
    if (user && user.emailVerificationToken) {
      console.log('🎯 OTP found in database:', user.emailVerificationToken);
      console.log('⏰ OTP expires at:', user.emailVerificationExpires);
      
      // Step 3: Verify OTP
      console.log('\n🔐 Step 3: Verifying OTP...');
      
      const verifyResponse = await axios.post(`${BASE_URL}/auth/verify-email`, {
        email: 'vaishuxx2024@gmail.com',
        otp: user.emailVerificationToken
      });
      
      console.log('✅ OTP verification successful:', verifyResponse.data.message);
      
      if (verifyResponse.data.token) {
        console.log('🔑 JWT token received');
        
        // Step 4: Test protected endpoint
        console.log('\n🛡️ Step 4: Testing protected endpoint...');
        
        const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${verifyResponse.data.token}`
          }
        });
        
        console.log('✅ Protected endpoint access successful!');
        console.log('👤 User profile:', profileResponse.data.user.name);
        console.log('📧 Email verified:', profileResponse.data.user.emailVerified);
        
        console.log('\n🎉 COMPLETE FLOW TEST SUCCESSFUL!');
        console.log('✅ Registration → OTP Generation → OTP Verification → JWT Token → Protected Access');
        
        // Step 5: Test login
        console.log('\n🔑 Step 5: Testing login with verified account...');
        
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
          email: 'vaishuxx2024@gmail.com',
          password: 'TestPass123!'
        });
        
        console.log('✅ Login successful:', loginResponse.data.message);
        console.log('🎯 Login token matches verification token:', 
          loginResponse.data.token === verifyResponse.data.token);
        
      }
    } else {
      console.log('❌ No OTP found in database. Check user creation.');
      console.log('User in DB:', user ? 'Found' : 'Not found');
    }
    
    await client.close();
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 400) {
      console.log('\n💡 Possible reasons:');
      console.log('• User already exists (run clear-test-email.js first)');
      console.log('• Validation errors in request data');
      console.log('• OTP expired');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Server not running. Start with: npm run dev');
    }
  }
  
  rl.close();
}

// Add cleanup option
async function cleanup() {
  try {
    const { MongoClient } = require('mongodb');
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://vaishnavisudarsanam11_db_user:RnUqsHOusQ0rmy25@cluster0.fzkfm6p.mongodb.net/rentmate?retryWrites=true&w=majority&appName=Cluster0';
    
    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db('rentmate');
    
    const result = await db.collection('users').deleteOne({ email: 'vaishuxx2024@gmail.com' });
    console.log('🧹 Cleanup:', result.deletedCount > 0 ? 'User removed' : 'No user to remove');
    
    await client.close();
  } catch (error) {
    console.log('🧹 Cleanup failed:', error.message);
  }
}

async function main() {
  // Check if server is running
  try {
    await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server is running\n');
  } catch (error) {
    console.log('❌ Server not running. Please start with: npm run dev');
    rl.close();
    return;
  }
  
  console.log('Choose an option:');
  console.log('1. Run complete flow test');
  console.log('2. Cleanup test user');
  
  rl.question('Enter choice (1 or 2): ', async (choice) => {
    if (choice === '1') {
      await testCompleteFlowWithConsoleOTP();
    } else if (choice === '2') {
      await cleanup();
      rl.close();
    } else {
      console.log('Invalid choice');
      rl.close();
    }
  });
}

require('dotenv').config();
main();
