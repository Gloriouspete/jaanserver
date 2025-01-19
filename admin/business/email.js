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

const Email = async (email) => {
  const mailOptions = {
    from: '"Jaan Services" <hello@jaan.ng>',
    to: email,
    subject: 'Congratulations! You Have Been Upgraded to Business Status!',
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Business Status Upgrade</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #000; padding: 20px; border-radius: 10px; color: #fff;">
        <header style="text-align: center; color: #ffffff;">
          <h1>Congratulations! You've Been Upgraded to Business Status!</h1>
          <p style="font-size: 16px; line-height: 1.6;">
            We are excited to let you know that your account has been upgraded to <strong>Business</strong> status.
            This means you now have access to our powerful API and can process unlimited transactions.
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            As a Business user, you can enjoy the full range of features, including unlimited transactions and API access to streamline your processes.
            We are here to help you succeed!
          </p>
        </header>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="https://jaan.ng" style="background-color: #00ff00; border-radius: 15px; display: inline-block; padding: 10px 20px; text-decoration: none; color: #fff; font-size: 22px;">
            Access Your Business Dashboard
          </a>
        </div>

        <hr style="border-color: #fff;">
        
        <div style="text-align: center; margin: 20px 0;">
          <img src="https://i.ibb.co/yF1pjp2/jaan-logo-wm.png" alt="Jaan Logo" style="background-color: #ffffff; width: 50px; height: 50px; border-radius: 50%;">
        </div>
        
        <footer style="text-align: center; font-size: 10px; color: #fff;">
          Not you? Please ignore this message.
        </footer>
      </div>
    </body>
    </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Business status upgrade email sent successfully');
    return true;
  } catch (error) {
    console.log('Error sending email:', error);
    return false;
  }
}



module.exports = Email