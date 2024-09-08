const executor = require("../config/db.js");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET;
 async function Verifyacc(req, res) {
  const { param } = req.body;
  try {
    const decoded = jwt.verify(param, secretKey);
    if (!decoded) {
      return res.json({
        success: false,
        message: "Expired or incorrect link , try requesting again",
      });
    }
    const second = `UPDATE users SET emailverified = 'yes' WHERE email = ?`;
    await executor(second, [decoded.email]); // Wait for the execution to finish
    return res.status(200).json({ success: true, message: "Email successfully verified" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while verifying email",
    });
  }
}

module.exports = Verifyacc;