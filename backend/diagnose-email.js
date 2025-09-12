require('dotenv').config();

console.log('🔍 Detailed Email Configuration Analysis\n');

// Check environment variables
console.log('📋 Environment Variables:');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
console.log('EMAIL_USER:', process.env.EMAIL_USER);

// Analyze the App Password
const appPassword = process.env.EMAIL_PASS;
console.log('\n🔑 App Password Analysis:');
console.log('Length:', appPassword?.length);
console.log('First 4 chars:', appPassword?.substring(0, 4));
console.log('Last 4 chars:', appPassword?.substring(appPassword.length - 4));
console.log('Contains spaces:', appPassword?.includes(' '));
console.log('Raw format:', appPassword);

// Check if it matches Gmail App Password format
const expectedLength = 16; // Gmail App Passwords are 16 characters
const hasSpaces = appPassword?.includes(' ');

console.log('\n📊 App Password Validation:');
if (appPassword?.length === expectedLength) {
  console.log('✅ Length is correct (16 characters)');
} else {
  console.log('❌ Length is incorrect. Expected 16, got:', appPassword?.length);
}

if (hasSpaces) {
  console.log('❌ Contains spaces - this might cause issues');
  console.log('💡 Try removing spaces from the App Password');
} else {
  console.log('✅ No spaces detected');
}

// Suggest fixes
console.log('\n🔧 Troubleshooting Steps:');
console.log('1. Verify 2-Factor Authentication is enabled on Gmail');
console.log('2. Generate a new App Password from Gmail settings');
console.log('3. Use the App Password exactly as provided (no spaces)');
console.log('4. Update .env file with the new App Password');

console.log('\n📧 Gmail App Password Setup:');
console.log('• Go to https://myaccount.google.com/security');
console.log('• Enable 2-Step Verification if not already enabled');
console.log('• Go to App passwords section');
console.log('• Generate new password for "Mail" application');
console.log('• Copy the 16-character password (ignore spaces in display)');

// Test a simple connection without sending email
const nodemailer = require('nodemailer');

async function testConnection() {
  console.log('\n🔗 Testing SMTP Connection...');
  
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      connectionTimeout: 10000, // 10 seconds timeout
      greetingTimeout: 5000,     // 5 seconds timeout
      socketTimeout: 10000       // 10 seconds timeout
    });
    
    // Test with timeout
    const result = await Promise.race([
      transporter.verify(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 15000)
      )
    ]);
    
    console.log('✅ SMTP connection successful!');
    return true;
    
  } catch (error) {
    console.error('❌ SMTP connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔑 Authentication Failed - Solutions:');
      console.log('• Double-check the App Password');
      console.log('• Ensure 2FA is enabled');
      console.log('• Try generating a new App Password');
    } else if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
      console.log('\n⏰ Connection Timeout - Solutions:');
      console.log('• Check internet connection');
      console.log('• Verify firewall/antivirus settings');
      console.log('• Try different network if on corporate/restricted network');
    } else if (error.code === 'ENOTFOUND') {
      console.log('\n🌐 DNS Resolution Failed - Solutions:');
      console.log('• Check internet connection');
      console.log('• Verify EMAIL_HOST setting');
      console.log('• Try using IP address instead of hostname');
    }
    
    return false;
  }
}

testConnection();
