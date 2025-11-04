const emailTemplate = (content) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center; }
        .header h1 { color: #ffffff; font-size: 28px; font-weight: 600; margin: 0; }
        .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
        .footer { background-color: #f8f9fa; padding: 20px 30px; text-align: center; font-size: 13px; color: #6c757d; border-top: 1px solid #e9ecef; }
        .footer a { color: #667eea; text-decoration: none; }
        @media only screen and (max-width: 600px) {
          .email-container { margin: 0; border-radius: 0; }
          .content { padding: 30px 20px; }
          .footer { padding: 15px 20px; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>AutoCP</h1>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} AutoCP. All rights reserved.</p>
          <p style="margin-top: 8px;">AI-Powered Competitive Programming Platform</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = emailTemplate;
