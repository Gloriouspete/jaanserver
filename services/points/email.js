const { createTransport } = require('nodemailer');
require('dotenv').config()
const emailpass = process.env.BREVO
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
    pass: emailpass,
  },
});

const Email = async (email, code) => {
  const mailOptions = {
    from: '"Jaan Services" <hello@jaan.ng>',
    to: email,
    subject: `You just received some points`,
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>You Received ${code} Points!</title>
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
          background-color: #ffffff;
          padding: 20px;
          border-radius: 10px;
          color: #333333;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          color: #ffffff;
          background-color: #007bff;
          padding: 20px;
          border-radius: 10px 10px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 20px;
        }
        .content p {
          font-size: 16px;
          line-height: 1.6;
        }
        .button-container {
          text-align: center;
          margin: 20px 0;
        }
        .button-container a {
          background-color: #28a745;
          border-radius: 5px;
          padding: 10px 20px;
          text-decoration: none;
          color: #ffffff;
          font-size: 18px;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #888888;
          margin-top: 20px;
        }
        .logo-container {
          text-align: center;
          margin: 20px 0;
        }
        .logo-container img {
          background-color: #ffffff;
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Congratulations! You Earned Points!</h1>
        </div>
        <div class="content">
          <p>Dear User,</p>
          <p>You just received <strong>${code}</strong> points for your recent transaction. Check it out at <a href="https://jaan.ng/points" style="color: #007bff;">jaan.ng/points</a>.</p>
        </div>
        <div class="button-container">
          <a href="https://jaan.ng/points">View Your Points</a>
        </div>
        <div class="logo-container">
          <img src="https://i.ibb.co/yF1pjp2/jaan-logo-wm.png" alt="Jaan Logo">
        </div>
        <div class="footer">
          <p>If you have any questions, feel free to reach out to us.</p>
        </div>
      </div>
    </body>
    </html>
    `
    
  };



  try {
    await transporter.sendMail(mailOptions);
    console.log('Points email sent successfully');
    return true
  } catch (error) {
    console.log(error);
  }


}



module.exports = Email;