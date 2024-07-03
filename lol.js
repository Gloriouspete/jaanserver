const { createTransport } = require('nodemailer');
require('dotenv').config()
const emailpass = process.env.EMAIL_PASS
const transporter = createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587, 
  secure: false,
  secureConnection: false,
  connectionTimeout: 100000,
  tls: {
    rejectUnauthorized: false
  },
  auth: {
    user: 'mcgrin1@gmail.com', 
    pass: 'HOAR1FI32SCfvayE',
  },
});


const welcome = async (email, name) => {
  const mailOptions = {
    from: '"Jaan Mobile Services" <hello@jaan.ng>', 
    to: email,
    subject: 'Welcome to Jaan Services!',
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Jaan Mobile services!</title>
      
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <div class="email-container" style="max-width: 600px; margin: 0 auto; background-color: #000; padding: 20px; border-radius: 10px; color: #fff;">
        <div class="header" style="text-align: center; color: #ffffff;">
          <h1>Welcome to Jaan Mobile Services!</h1>
          <p class="welcome-text" style="font-size: 16px; line-height: 1.6; color: #fff; text-align: center;">Dear ${name}, We're excited to have you join us. Welcome to the community!</p>
          <p class="welcome-text" style="font-size: 16px; line-height: 1.6; color: #fff; text-align: center;">If you have any issues or complaints, please don't hesitate to reach out to customer service; we'd be so glad to help!</p>
        </div>
        
        <div class="logo-container" style="text-align: center; margin: 20px 0;">
          <img src="https://i.ibb.co/yF1pjp2/jaan-logo-wm.png" alt="Jaan Logo" class="logo" style="background-color: #ffffff; width: 50px; height: 50px; border-radius: 50%; display: inline-block;" width="50" height="50">
        </div>
    
        <p class="footer" style="font-size: 10px; color: #fff; text-align: center;">If you have any questions, feel free to reach out to us.</p>
      </div>
    </body>
    </html>
    
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.log(error);
  }
};

welcome('peterninyo4@gmail.com',"tunde")