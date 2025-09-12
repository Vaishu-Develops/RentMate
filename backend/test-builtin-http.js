const http = require('http');
const { MongoClient } = require('mongodb');
require('dotenv').config();

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({ status: res.statusCode, data: result });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    
    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

async function testWithBuiltinHttp() {
  console.log('🚀 Testing Registration with Built-in HTTP\n');
  
  try {
    // Test health endpoint
    console.log('🔍 Testing health endpoint...');
    const healthOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/health',
      method: 'GET'
    };
    
    const healthResult = await makeRequest(healthOptions);
    console.log('✅ Health check:', healthResult.status, healthResult.data);
    
    if (healthResult.status !== 200) {
      console.log('❌ Server not responding properly');
      return;
    }
    
    // Clear existing user
    console.log('\n🧹 Clearing existing user...');
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db('rentmate');
    
    const deleteResult = await db.collection('users').deleteOne({ email: 'vaishuxx2024@gmail.com' });
    console.log('✅ Cleared users:', deleteResult.deletedCount);
    
    // Register user
    console.log('\n📝 Registering user...');
    const registerOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const registerData = {
      name: 'Test User',
      email: 'vaishuxx2024@gmail.com',
      password: 'TestPass123!',
      confirmPassword: 'TestPass123!',
      phone: '+919876543210',
      agreeToTerms: true
    };
    
    console.log('📤 Sending registration...');
    const registerResult = await makeRequest(registerOptions, registerData);
    console.log('📥 Registration response:', registerResult.status, registerResult.data.message || registerResult.data);
    
    if (registerResult.status === 201 || registerResult.status === 200) {
      console.log('✅ Registration successful!');
      
      // Wait a moment for database to update
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get OTP from database
      console.log('\n🔍 Checking database for OTP...');
      const user = await db.collection('users').findOne({ email: 'vaishuxx2024@gmail.com' });
      
      if (user && user.emailVerificationToken) {
        const otp = user.emailVerificationToken.substring(0, 6).toUpperCase();
        console.log('\n🎯 OTP FOUND:', otp);
        console.log('📧 Email:', user.email);
        console.log('⏰ Expires:', new Date(user.emailVerificationExpires));
        console.log('✅ Email verified:', user.emailVerified);
        
        // Verify OTP
        console.log('\n🔐 Verifying OTP...');
        const verifyOptions = {
          hostname: 'localhost',
          port: 5000,
          path: '/api/auth/verify-email',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        };
        
        const verifyData = {
          email: 'vaishuxx2024@gmail.com',
          otp: otp
        };
        
        const verifyResult = await makeRequest(verifyOptions, verifyData);
        console.log('📥 Verify response:', verifyResult.status, verifyResult.data.message || verifyResult.data);
        
        if (verifyResult.status === 200 && verifyResult.data.token) {
          console.log('✅ OTP verification successful!');
          console.log('🔑 JWT token received');
          
          // Test protected endpoint
          console.log('\n🛡️ Testing protected endpoint...');
          const profileOptions = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/me',
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${verifyResult.data.token}`
            }
          };
          
          const profileResult = await makeRequest(profileOptions);
          console.log('📥 Profile response:', profileResult.status);
          
          if (profileResult.status === 200) {
            console.log('✅ Protected endpoint access successful!');
            console.log('👤 User:', profileResult.data.user?.name);
            console.log('📧 Email verified:', profileResult.data.user?.emailVerified);
            
            console.log('\n🎉 COMPLETE FLOW TEST SUCCESSFUL!');
            console.log('✅ Registration → OTP → Verification → JWT → Protected Access');
            
            // Final check: Try login
            console.log('\n🔑 Testing login...');
            const loginOptions = {
              hostname: 'localhost',
              port: 5000,
              path: '/api/auth/login',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              }
            };
            
            const loginData = {
              email: 'vaishuxx2024@gmail.com',
              password: 'TestPass123!'
            };
            
            const loginResult = await makeRequest(loginOptions, loginData);
            console.log('📥 Login response:', loginResult.status, loginResult.data.message || 'Success');
            
            if (loginResult.status === 200) {
              console.log('✅ Login successful with verified account!');
            }
            
          } else {
            console.log('❌ Protected endpoint failed:', profileResult.data);
          }
        } else {
          console.log('❌ OTP verification failed:', verifyResult.data);
        }
      } else {
        console.log('❌ No OTP found in database');
        console.log('User exists:', !!user);
        if (user) {
          console.log('User data:', {
            email: user.email,
            emailVerified: user.emailVerified,
            hasToken: !!user.emailVerificationToken
          });
        }
      }
    } else {
      console.log('❌ Registration failed:', registerResult.data);
    }
    
    await client.close();
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

console.log('🔧 Starting built-in HTTP test...');
testWithBuiltinHttp().then(() => {
  console.log('\n✨ Test completed!');
}).catch(error => {
  console.error('Fatal error:', error);
});
