const nodemailer = require('nodemailer')

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  // Since you have a real Gmail App Password, let's use it even in development
  console.log('📧 Configuring Gmail SMTP with App Password...')
  
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })
}

// Email templates
const emailTemplates = {
  emailVerification: (data) => ({
    subject: 'RentMate - Verify Your Email Address',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - RentMate</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 30px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .code { font-size: 24px; font-weight: bold; color: #3b82f6; letter-spacing: 3px; text-align: center; padding: 20px; background: white; border: 2px dashed #3b82f6; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏠 RentMate</h1>
            <p>Welcome to India's Smart Rental Platform</p>
          </div>
          <div class="content">
            <h2>Hi ${data.name}!</h2>
            <p>Thank you for joining RentMate! To complete your registration, please verify your email address.</p>
            
            <p>You can verify your email in two ways:</p>
            
            <h3>Option 1: Click the verification link</h3>
            <p style="text-align: center;">
              <a href="${data.verificationUrl}" class="button">Verify Email Address</a>
            </p>
            
            <h3>Option 2: Enter this verification code</h3>
            <div class="code">${data.verificationCode}</div>
            
            <p><strong>Important:</strong></p>
            <ul>
              <li>This verification link will expire in 24 hours</li>
              <li>If you didn't create a RentMate account, please ignore this email</li>
              <li>For security, don't share this code with anyone</li>
            </ul>
            
            <p>Once verified, you'll be able to:</p>
            <ul>
              <li>🔍 Search verified properties</li>
              <li>🏠 List your properties with AI assistance</li>
              <li>💳 Make secure rent payments</li>
              <li>🤖 Get AI-powered recommendations</li>
            </ul>
          </div>
          <div class="footer">
            <p>Need help? Contact us at support@rentmate.com</p>
            <p>© 2024 RentMate. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  passwordReset: (data) => ({
    subject: 'RentMate - Password Reset Request',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - RentMate</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 30px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏠 RentMate</h1>
            <p>Password Reset Request</p>
          </div>
          <div class="content">
            <h2>Hi ${data.name}!</h2>
            <p>We received a request to reset your RentMate account password.</p>
            
            <p style="text-align: center;">
              <a href="${data.resetUrl}" class="button">Reset Password</a>
            </p>
            
            <div class="warning">
              <h3>⚠️ Security Notice</h3>
              <ul>
                <li>This reset link will expire in 10 minutes</li>
                <li>If you didn't request this reset, please ignore this email</li>
                <li>Your password will remain unchanged until you create a new one</li>
                <li>For security, this link can only be used once</li>
              </ul>
            </div>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #3b82f6;">${data.resetUrl}</p>
            
            <p>If you're having trouble, contact our support team at support@rentmate.com</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
            <p>© 2024 RentMate. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  applicationReceived: (data) => ({
    subject: `New Rental Application - ${data.propertyTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Application Received - RentMate</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .applicant-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .ai-summary { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏠 RentMate</h1>
            <p>New Rental Application Received</p>
          </div>
          <div class="content">
            <h2>Hi ${data.landlordName}!</h2>
            <p>Great news! You've received a new application for your property:</p>
            
            <div class="applicant-info">
              <h3>📋 Property: ${data.propertyTitle}</h3>
              <p><strong>Applicant:</strong> ${data.applicantName}</p>
              <p><strong>Applied on:</strong> ${data.applicationDate}</p>
              <p><strong>Preferred Move-in:</strong> ${data.moveInDate}</p>
              <p><strong>Monthly Income:</strong> ₹${data.monthlyIncome?.toLocaleString()}</p>
              <p><strong>Occupation:</strong> ${data.occupation}</p>
            </div>
            
            ${data.aiSummary ? `
            <div class="ai-summary">
              <h3>🤖 AI Screening Summary</h3>
              <p>${data.aiSummary}</p>
            </div>
            ` : ''}
            
            <p><strong>Applicant's Message:</strong></p>
            <p style="font-style: italic; background: white; padding: 15px; border-radius: 5px;">"${data.message}"</p>
            
            <p style="text-align: center;">
              <a href="${data.reviewUrl}" class="button">Review Application</a>
            </p>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>Review the complete application and documents</li>
              <li>Check the AI screening recommendations</li>
              <li>Contact the applicant if you need more information</li>
              <li>Accept or decline the application</li>
            </ul>
          </div>
          <div class="footer">
            <p>Manage all your applications at dashboard.rentmate.com</p>
            <p>© 2024 RentMate. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  rentReminder: (data) => ({
    subject: `Rent Due Reminder - ${data.propertyAddress}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rent Due Reminder - RentMate</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f59e0b; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 30px; background: #f59e0b; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .payment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏠 RentMate</h1>
            <p>Rent Payment Reminder</p>
          </div>
          <div class="content">
            <h2>Hi ${data.tenantName}!</h2>
            <p>This is a friendly reminder that your rent payment is due soon.</p>
            
            <div class="payment-details">
              <h3>💳 Payment Details</h3>
              <p><strong>Property:</strong> ${data.propertyAddress}</p>
              <p><strong>Due Date:</strong> ${data.dueDate}</p>
              <p><strong>Amount:</strong> ₹${data.amount?.toLocaleString()}</p>
              <p><strong>Days Until Due:</strong> ${data.daysUntilDue}</p>
            </div>
            
            <p style="text-align: center;">
              <a href="${data.paymentUrl}" class="button">Pay Now</a>
            </p>
            
            <p><strong>Payment Options:</strong></p>
            <ul>
              <li>💳 Credit/Debit Card</li>
              <li>🏦 Net Banking</li>
              <li>📱 UPI</li>
              <li>💰 Digital Wallets</li>
            </ul>
            
            <p><strong>Benefits of Online Payment:</strong></p>
            <ul>
              <li>✅ Instant payment confirmation</li>
              <li>📧 Automatic HRA receipt generation</li>
              <li>📊 Payment history tracking</li>
              <li>🔒 Secure and encrypted transactions</li>
            </ul>
          </div>
          <div class="footer">
            <p>Questions? Contact your landlord or our support team</p>
            <p>© 2024 RentMate. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
}

// Send email function
const sendEmail = async (options) => {
  try {
    console.log('\n📧 Preparing to send email...')
    console.log('📧 To:', options.email || options.to)
    console.log('📝 Subject:', options.subject)
    
    // Create transporter with Gmail App Password
    const transporter = createTransporter()
    
    // Get template if specified
    let emailContent = {
      subject: options.subject,
      html: options.html || options.text
    }
    
    if (options.templateName && emailTemplates[options.templateName]) {
      emailContent = emailTemplates[options.templateName](options.templateData || {})
    }
    
    // Also log the verification code to console for backup
    if (options.templateName === 'emailVerification') {
      const verificationCode = options.templateData?.verificationCode || 'TEST123'
      console.log('🔑 VERIFICATION CODE (backup):', verificationCode)
      console.log('⏰ This code expires in 1 minute')
    }
    
    const mailOptions = {
      from: `"RentMate" <${process.env.EMAIL_USER}>`,
      to: options.email || options.to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: options.text // Fallback text version
    }
    
    const info = await transporter.sendMail(mailOptions)
    
    console.log('✅ Email sent successfully:', info.messageId)
    return {
      success: true,
      messageId: info.messageId
    }
  } catch (error) {
    console.error('❌ Email sending failed:', error)
    throw new Error(`Failed to send email: ${error.message}`)
  }
}

// Send bulk emails (for notifications, newsletters, etc.)
const sendBulkEmail = async (recipients, template, data) => {
  try {
    const results = []
    
    for (const recipient of recipients) {
      try {
        const result = await sendEmail({
          to: recipient.email,
          template,
          data: { ...data, ...recipient }
        })
        results.push({ email: recipient.email, success: true, messageId: result.messageId })
      } catch (error) {
        results.push({ email: recipient.email, success: false, error: error.message })
      }
    }
    
    return results
  } catch (error) {
    console.error('Bulk email sending failed:', error)
    throw new Error(`Failed to send bulk emails: ${error.message}`)
  }
}

module.exports = {
  sendEmail,
  sendBulkEmail,
  emailTemplates
}