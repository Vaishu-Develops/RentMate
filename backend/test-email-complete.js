const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmailComplete() {
  console.log('🧪 Starting comprehensive email diagnostics...\n');
  
  // 1. Check environment variables
  console.log('📋 Environment Configuration:');
  console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
  console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-4) : 'NOT SET');
  console.log('');
  
  // 2. Create transporter
  console.log('🔧 Creating email transporter...');
  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    debug: true, // Enable debug logs
    logger: true // Enable logger
  });
  
  try {
    // 3. Test connection
    console.log('🔗 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');
    
    // 4. Send test OTP email
    console.log('📧 Sending test OTP email...');
    const testOTP = Math.floor(100000 + Math.random() * 900000).toString();
    
    const mailOptions = {
      from: `"RentMate" <${process.env.EMAIL_USER}>`,
      to: 'vaishuxx2024@gmail.com',
      subject: 'RentMate - Test OTP Verification',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Test OTP - RentMate</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background: #f9f9f9; }
            .code { font-size: 28px; font-weight: bold; color: #3b82f6; letter-spacing: 3px; text-align: center; padding: 20px; background: white; border: 2px dashed #3b82f6; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏠 RentMate - TEST EMAIL</h1>
            </div>
            <div class="content">
              <h2>Email Delivery Test</h2>
              <p>This is a test email to verify OTP delivery is working.</p>
              
              <p><strong>Your Test OTP Code is:</strong></p>
              <div class="code">${testOTP}</div>
              
              <p>✅ If you receive this email, the email configuration is working correctly!</p>
              <p>📧 Sent from: ${process.env.EMAIL_USER}</p>
              <p>📧 Sent to: vaishuxx2024@gmail.com</p>
              <p>⏰ Sent at: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📨 Response:', info.response);
    console.log('');
    
    console.log('🎯 Test OTP Generated:', testOTP);
    console.log('📮 Email sent to: vaishuxx2024@gmail.com');
    console.log('');
    console.log('📋 Next Steps:');
    console.log('1. Check the inbox for vaishuxx2024@gmail.com');
    console.log('2. Also check SPAM/Junk folder');
    console.log('3. Verify the OTP code matches:', testOTP);
    console.log('4. If email not received, check Gmail security settings');
    
    return { success: true, otp: testOTP };
    
  } catch (error) {
    console.error('❌ Email test failed:');
    console.error('Error Type:', error.constructor.name);
    console.error('Error Message:', error.message);
    console.error('Error Code:', error.code);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔑 Authentication Issue Detected:');
      console.log('• Gmail App Password might be incorrect');
      console.log('• 2FA must be enabled on Gmail account');
      console.log('• App Password should be 16 characters without spaces');
    } else if (error.code === 'ENOTFOUND') {
      console.log('\n🌐 Network Issue Detected:');
      console.log('• Check internet connection');
      console.log('• Verify EMAIL_HOST is correct');
    } else if (error.code === 'ECONNECTION') {
      console.log('\n🔗 Connection Issue Detected:');
      console.log('• Check EMAIL_PORT setting');
      console.log('• Verify firewall/antivirus settings');
    }
    
    return { success: false, error: error.message };
  }
}

// Also test the actual email utility function
async function testEmailUtility() {
  console.log('\n🔧 Testing email utility function...');
  
  try {
    const emailUtils = require('./utils/email');
    
    const testData = {
      name: 'Test User',
      email: 'vaishuxx2024@gmail.com',
      verificationCode: '123456',
      verificationUrl: 'http://localhost:3000/verify-email?token=test-token'
    };
    
    const result = await emailUtils.sendVerificationEmail(testData);
    console.log('✅ Email utility test result:', result);
    
  } catch (error) {
    console.error('❌ Email utility test failed:', error.message);
  }
}

// Run both tests
async function runAllTests() {
  await testEmailComplete();
  await testEmailUtility();
}

if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { testEmailComplete, testEmailUtility };
