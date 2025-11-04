const emailTemplate = require('./emailTemplate');

const emailContent = {
  verificationCode: (name, code) => {
    const content = `
      <h2 style="color: #333; margin-bottom: 20px;">Welcome to AutoCP, ${name}!</h2>
      <p style="margin-bottom: 15px;">Thank you for registering with AutoCP. Please verify your email address to get started.</p>
      <p style="margin-bottom: 25px;">Your verification code is:</p>
      <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; text-align: center;">
        <h1 style="color: #667eea; font-size: 36px; letter-spacing: 8px; margin: 0;">${code}</h1>
      </div>
      <p style="margin-top: 25px; color: #6c757d; font-size: 14px;">This code will expire in 10 minutes.</p>
      <p style="margin-top: 15px; color: #6c757d; font-size: 14px;">If you didn't create an account, please ignore this email.</p>
    `;
    return emailTemplate(content);
  },

  welcomeEmail: (name) => {
    const content = `
      <h2 style="color: #333; margin-bottom: 20px;">Welcome to AutoCP, ${name}! 🎉</h2>
      <p style="margin-bottom: 15px;">Your account has been successfully verified!</p>
      <p style="margin-bottom: 15px;">You can now access all features of AutoCP:</p>
      <ul style="margin: 20px 0; padding-left: 20px; color: #555;">
        <li style="margin-bottom: 10px;">Generate AI-powered competitive programming problems</li>
        <li style="margin-bottom: 10px;">Create custom testcases automatically</li>
        <li style="margin-bottom: 10px;">Export problems in judge-ready format</li>
        <li style="margin-bottom: 10px;">Host programming contests with ease</li>
      </ul>
      <p style="margin-top: 25px;">Happy problem setting! 🚀</p>
    `;
    return emailTemplate(content);
  },

  passwordReset: (name, code) => {
    const content = `
      <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
      <p style="margin-bottom: 15px;">Hi ${name},</p>
      <p style="margin-bottom: 15px;">We received a request to reset your password. Use the code below to reset it:</p>
      <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; text-align: center;">
        <h1 style="color: #667eea; font-size: 36px; letter-spacing: 8px; margin: 0;">${code}</h1>
      </div>
      <p style="margin-top: 25px; color: #6c757d; font-size: 14px;">This code will expire in 10 minutes.</p>
      <p style="margin-top: 15px; color: #6c757d; font-size: 14px;">If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
    `;
    return emailTemplate(content);
  },

  loginAlert: (name, timestamp, location = 'Unknown') => {
    const content = `
      <h2 style="color: #333; margin-bottom: 20px;">New Login Detected</h2>
      <p style="margin-bottom: 15px;">Hi ${name},</p>
      <p style="margin-bottom: 15px;">A new login to your AutoCP account was detected:</p>
      <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 6px;">
        <p style="margin: 8px 0;"><strong>Time:</strong> ${timestamp}</p>
        <p style="margin: 8px 0;"><strong>Location:</strong> ${location}</p>
      </div>
      <p style="margin-top: 25px; color: #6c757d; font-size: 14px;">If this wasn't you, please reset your password immediately and contact our support team.</p>
    `;
    return emailTemplate(content);
  }
};

module.exports = emailContent;
