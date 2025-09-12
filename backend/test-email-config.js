const nodemailer = require('nodemailer')
require('dotenv').config()

async function testEmailConfig() {
  try {
    console.log('🔍 Testing Email Configuration...')
    
    // Check if environment variables are set
    console.log('📧 Email Environment Variables:')
    console.log(`EMAIL_HOST: ${process.env.EMAIL_HOST || 'Not set'}`)
    console.log(`EMAIL_PORT: ${process.env.EMAIL_PORT || 'Not set'}`)
    console.log(`EMAIL_USER: ${process.env.EMAIL_USER || 'Not set'}`)
    console.log(`EMAIL_PASS: ${process.env.EMAIL_PASS ? '***SET***' : 'Not set'}`)
    
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('❌ Email configuration is incomplete!')
      console.log('💡 Please check your .env file')
      return
    }
    
    // Create transporter
    console.log('\n🔧 Creating email transporter...')
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
    
    // Test connection
    console.log('🔌 Testing SMTP connection...')
    await transporter.verify()
    console.log('✅ SMTP connection successful!')
    
    // Send test email
    console.log('📧 Sending test email...')
    const testOTP = Math.floor(100000 + Math.random() * 900000).toString()
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'vaishuxx2024@gmail.com',
      subject: 'RentMate - Test OTP',
      html: `
        <h2>🏠 RentMate Test OTP</h2>
        <p>Your test verification code is: <strong style="font-size: 24px; color: #007bff;">${testOTP}</strong></p>
        <p>This is a test email to verify the email configuration.</p>
        <p>Time: ${new Date().toISOString()}</p>
      `
    }
    
    const result = await transporter.sendMail(mailOptions)
    console.log('✅ Test email sent successfully!')
    console.log('📋 Email details:')
    console.log(`   Message ID: ${result.messageId}`)
    console.log(`   Test OTP: ${testOTP}`)
    console.log(`   Sent to: vaishuxx2024@gmail.com`)
    
    console.log('\n✨ Email configuration is working!')
    console.log('📱 Check your Gmail inbox (and spam folder) for the test email')
    
  } catch (error) {
    console.error('❌ Email test failed:')
    console.error('Error:', error.message)
    
    if (error.code === 'EAUTH') {
      console.log('\n💡 Authentication failed. Possible solutions:')
      console.log('1. Check if EMAIL_USER and EMAIL_PASS are correct')
      console.log('2. Make sure you\'re using an App Password, not your regular Gmail password')
      console.log('3. Enable 2-factor authentication and generate an App Password')
    } else if (error.code === 'ECONNECTION') {
      console.log('\n💡 Connection failed. Possible solutions:')
      console.log('1. Check your internet connection')
      console.log('2. Verify EMAIL_HOST and EMAIL_PORT settings')
      console.log('3. Check if your firewall/antivirus is blocking the connection')
    }
  }
}

testEmailConfig()
