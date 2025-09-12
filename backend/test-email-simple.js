const nodemailer = require('nodemailer');
require('dotenv').config();

async function simplifiedEmailTest() {
  console.log('🧪 Running simplified email test...\n');
  
  // Check env vars
  console.log('📋 Environment Check:');
  console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
  console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS length:', process.env.EMAIL_PASS?.length);
  console.log('');
    // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
  try {
    // Test connection first
    console.log('🔗 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');
    
    // Generate test OTP
    const testOTP = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('🎯 Generated test OTP:', testOTP);
    
    // Send simple test email
    console.log('📧 Sending test email...');
    const info = await transporter.sendMail({
      from: `"RentMate Test" <${process.env.EMAIL_USER}>`,
      to: 'vaishuxx2024@gmail.com',
      subject: 'RentMate - OTP Test Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #3b82f6;">🏠 RentMate - OTP Test</h1>
          <p>This is a test email to verify OTP delivery.</p>
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1e40af;">Your OTP Code:</h2>
            <div style="font-size: 32px; font-weight: bold; color: #3b82f6; text-align: center; letter-spacing: 4px; padding: 20px; background: white; border: 2px dashed #3b82f6; border-radius: 8px;">
              ${testOTP}
            </div>
          </div>
          <p><strong>Test Details:</strong></p>
          <ul>
            <li>Sent from: ${process.env.EMAIL_USER}</li>
            <li>Sent to: vaishuxx2024@gmail.com</li>
            <li>Time: ${new Date().toLocaleString()}</li>
          </ul>
          <p style="color: #10b981;">✅ If you receive this email, OTP delivery is working!</p>
        </div>
      `
    });
    
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    console.log('');
    
    console.log('📋 Action Required:');
    console.log('1. Check inbox for vaishuxx2024@gmail.com');
    console.log('2. Look for email with subject: "RentMate - OTP Test Email"');
    console.log('3. Check spam/junk folder if not in inbox');
    console.log('4. Verify OTP code matches:', testOTP);
    
    return { success: true, otp: testOTP, messageId: info.messageId };
    
  } catch (error) {
    console.error('❌ Email test failed:');
    console.error('Error:', error.message);
    
    // Provide specific error guidance
    if (error.code === 'EAUTH') {
      console.log('\n🔑 Authentication Error - Possible solutions:');
      console.log('• Verify Gmail App Password is correct');
      console.log('• Ensure 2-Factor Authentication is enabled');
      console.log('• Check App Password format (16 chars, no spaces)');
      console.log('• Current password length:', process.env.EMAIL_PASS?.length);
    }
    
    return { success: false, error: error.message };
  }
}

// Test the actual email utility
async function testEmailUtilityCorrect() {
  console.log('\n🔧 Testing email utility with correct function...');
  
  try {
    const { sendEmail } = require('./utils/email');
    
    const testOTP = Math.floor(100000 + Math.random() * 900000).toString();
    
    const result = await sendEmail({
      to: 'vaishuxx2024@gmail.com',
      templateName: 'emailVerification',
      templateData: {
        name: 'Test User',
        verificationCode: testOTP,
        verificationUrl: 'http://localhost:3000/verify-email?token=test-token'
      }
    });
    
    console.log('✅ Email utility test successful:', result);
    console.log('🎯 OTP sent via utility:', testOTP);
    
    return { success: true, otp: testOTP };
    
  } catch (error) {
    console.error('❌ Email utility test failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Starting email diagnostics...\n');
  
  const result1 = await simplifiedEmailTest();
  const result2 = await testEmailUtilityCorrect();
  
  console.log('\n📊 Test Summary:');
  console.log('Direct email test:', result1.success ? '✅ PASSED' : '❌ FAILED');
  console.log('Email utility test:', result2.success ? '✅ PASSED' : '❌ FAILED');
  
  if (result1.success && result2.success) {
    console.log('\n🎉 All tests passed! Email delivery should be working.');
    console.log('🔍 If emails are not received, check:');
    console.log('• Gmail inbox and spam folder');
    console.log('• Email delivery delays (can take 1-2 minutes)');
    console.log('• Gmail blocking due to sender reputation');
  }
}

if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { simplifiedEmailTest, testEmailUtilityCorrect };
