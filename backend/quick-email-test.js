const nodemailer = require('nodemailer');
require('dotenv').config();

async function quickEmailTest() {
  console.log('⚡ Quick Email Test with Fixed App Password\n');
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 5000,
    greetingTimeout: 3000
  });
  
  try {
    console.log('🔗 Testing connection...');
    await transporter.verify();
    console.log('✅ Connection successful!\n');
    
    // Send test OTP
    const testOTP = '123456';
    console.log('📧 Sending test OTP email...');
    
    const info = await transporter.sendMail({
      from: `"RentMate" <${process.env.EMAIL_USER}>`,
      to: 'vaishuxx2024@gmail.com',
      subject: 'RentMate - Your OTP Code',
      html: `
        <div style="font-family: Arial; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #3b82f6;">🏠 RentMate</h1>
          <h2>Your Verification Code</h2>
          <div style="font-size: 36px; font-weight: bold; color: #3b82f6; text-align: center; padding: 20px; background: #f0f9ff; border-radius: 8px; margin: 20px 0; letter-spacing: 5px;">
            ${testOTP}
          </div>
          <p>Enter this code to complete your registration.</p>
          <p><small>Sent at: ${new Date().toLocaleString()}</small></p>
        </div>
      `
    });
    
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('🎯 OTP sent:', testOTP);
    console.log('\n📬 Check vaishuxx2024@gmail.com inbox (and spam folder)');
    
    return { success: true, otp: testOTP };
    
  } catch (error) {
    console.error('❌ Failed:', error.message);
    return { success: false, error: error.message };
  }
}

quickEmailTest();
