const executor = require("../../config/db.js");
const { forgot } = require("../../email.js");
require('dotenv').config()
const jwt =  require('jsonwebtoken');
const generateVerificationCode = require('../../services/verifycode.js');
const secretKey = process.env.SECRET;

async function Forgot(req, res) {
  const { email } = req.body;
  if (email === "") {
    return res.json({ success: false, message: "Wetin you dey try do?" });
  }
  const query = `SELECT userid, password FROM users WHERE email = ?`;
  executor(query, [email])
    .then(async (results) => {
      if (results.length === 0) {
        return res.json({
          success: false,
          message: "Email Address not found in our system",
        });
      }
      const user = results[0];
      const decoded = jwt.sign({email}, secretKey, { expiresIn: "1h" });
      const link = `https://jaan.ng/reset-password?q=${decoded}`;
      await forgot(email, link);
      return res.status(200).json({
        success: true,
        message:
          "A reset link has been sent to your account and would expire in an hour",
      });
    })
    .catch((error) => {
      console.error("Error finding user credentials:", error);
      return res.json({success:false, message: "Internal server error" });
    });
}

module.exports = Forgot;