const { createTransport } = require("nodemailer");
require("dotenv").config();
const emailpass = process.env.BREVO;
const transporter = createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  secureConnection: false,
  connectionTimeout: 100000,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: "mcgrin1@gmail.com",
    pass: emailpass,
  },
});

const forgot = async (email, code) => {
  const mailOptions = {
    from: '"Jaan Services" <hello@jaan.ng>',
    to: email,
    subject: "Reset Password Otp!",
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
      
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <div class="email-container" style="max-width: 600px; margin: 0 auto; background-color: #000; padding: 20px; border-radius: 10px; color: #fff;">
        <div class="header" style="text-align: center; color: #ffffff;">
          <h1>You have requested to reset your password!</h1>
          <p style="font-size: 16px; line-height: 1.6;">We simply cannot send you your old password. A unique link has been generated for you. To reset your password, click the below button</p>
        </div>
        
        <a href=${code} class="otp-container" style="background-color: #0000ff; border-radius: 15px; width: 90px; height: 40px; text-align: center; justify-content: center; margin: 20px auto;">
          <strong class="otp" style="font-size: 22px; color: #fff; line-height: 40px;">RESET</strong>
        </a>
        <hr>
        <div class="logo-container" style="text-align: center; margin: 20px 0;">
          <img src="https://i.ibb.co/yF1pjp2/jaan-logo-wm.png" alt="jaan Logo" class="logo" style="background-color: #ffffff; width: 50px; height: 50px; border-radius: 50%; display: inline-block;" width="50" height="50">
        </div>
    
        <p class="footer" style="font-size: 10px; color: #fff; text-align: center;">Not you? Please ignore this message</p>
      </div>
    </body>
    </html>    
      `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("reset email sent successfully");
    return code;
  } catch (error) {
    console.log(error);
  }
};

const welcome = async (email, name) => {
  const mailOptions = {
    from: '"Jaan Mobile Services" <hello@jaan.ng>',
    to: email,
    subject: "Welcome to Jaan Services!",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Jaan Mobile Services!</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #000;
      padding: 20px;
      border-radius: 10px;
      color: #fff;
    }
    .header {
      text-align: center;
      color: #ffffff;
    }
    .welcome-text {
      font-size: 16px;
      line-height: 1.6;
      color: #fff;
      text-align: center;
    }
    .logo-container {
      text-align: center;
      margin: 20px 0;
    }
    .logo {
      background-color: #ffffff;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: inline-block;
    }
    .coupon {
      background-color: #ffcc00;
      color: #000;
      padding: 10px;
      border-radius: 5px;
      text-align: center;
      margin: 20px 0;
      font-size: 18px;
    }
    .footer {
      font-size: 10px;
      color: #fff;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Welcome to Jaan Mobile Services!</h1>
      <p class="welcome-text">Dear ${name}, We're excited to have you join us. Welcome to the community!</p>
      <p class="welcome-text">If you have any issues or complaints, please don't hesitate to reach out to customer service; we'd be so glad to help!</p>
    </div>
   
    <div class="coupon">
      <p>As a new user, use the coupon <strong>WELCOME10</strong> to claim ₦200!</p>
    </div>
    <div class="logo-container">
    <img src="https://i.ibb.co/yF1pjp2/jaan-logo-wm.png" alt="Jaan Logo" class="logo" width="50" height="50">
  </div>
    <p class="footer">If you have any questions, feel free to reach out to us.</p>
  </div>
</body>
</html>
`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully");
  } catch (error) {
    console.log(error);
  }
};

const sendVerificationEmail = async (email, name, verificationLink) => {
  const mailOptions = {
    from: '"Jaan Mobile Services" <hello@jaan.ng>',
    to: email,
    subject: "Please Verify Your Email Address",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #000;
      padding: 20px;
      border-radius: 10px;
      color: #fff;
    }
    .header {
      text-align: center;
      color: #ffffff;
    }
    .verification-text {
      font-size: 16px;
      line-height: 1.6;
      color: #fff;
      text-align: center;
    }
    .button {
      display: block;
      width: 200px;
      margin: 20px auto;
      padding: 10px;
      background-color: #ffcc00;
      color: #000;
      text-align: center;
      border-radius: 5px;
      text-decoration: none;
      font-size: 16px;
    }
    .footer {
      font-size: 10px;
      color: #fff;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Email Verification</h1>
      <p class="verification-text">Dear ${name},</p>
      <p class="verification-text">Thank you for registering with Jaan Mobile Services! To complete your registration, please verify your email address by clicking the link below:</p>
      <a href="${verificationLink}" class="button">Verify Your Email</a>
      <p class="verification-text">If you did not register with us, please ignore this email.</p>
    </div>
    <p class="footer">If you have any questions, feel free to reach out to us.</p>
  </div>
</body>
</html>
`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.log("Error sending verification email:", error);
  }
};


module.exports = { forgot, welcome,sendVerificationEmail };

/**
 * 
 *   html: `
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
 */
