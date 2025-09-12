// Quick fix for email handling in registration
// This is a patch to make email sending non-blocking in development

const originalSendEmail = require('./utils/email').sendEmail;

// Wrapper function for non-blocking email in development
const sendEmailSafe = async (options) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('📧 Development mode: Email details logged instead of sending');
    console.log('📧 To:', options.email || options.to);
    console.log('📧 Subject:', options.subject);
    
    // Extract verification code from template data
    if (options.templateData && options.templateData.verificationCode) {
      console.log('📧 Verification Code:', options.templateData.verificationCode);
    }
    if (options.templateData && options.templateData.verificationUrl) {
      console.log('📧 Verification URL:', options.templateData.verificationUrl);
    }
    
    // Return immediately in development
    return Promise.resolve({ messageId: 'dev-mode-skip' });
  } else {
    // In production, use the real email function
    return originalSendEmail(options);
  }
};

module.exports = { sendEmail: sendEmailSafe };
