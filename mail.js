const { createTransport } = require("nodemailer");
require("dotenv").config();
const emailpass = process.env.BREVO;
const transporter = createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587, 
  secure: false,
  secureConnection: false,
  connectionTimeout: 100000,
  tls: {
    rejectUnauthorized: false
  },
  logger: true, // Enable logging
  debug: true ,
  auth: {
    user: 'mcgrin1@gmail.com', 
    pass: emailpass,
  },
});


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

sendVerificationEmail("peterninyo4@gmail.com", "peter", "https://jaan.ng")