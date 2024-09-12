const executor = require("../../config/db.js");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET;
async function Checkverify(req, res) {
  const { userid } = req.user;
  try {
    const second = `SELECT emailverified from users WHERE userid = ?`;
    const results = await executor(second, [userid]);
    if (!results) {
      return res
        .status(404)
        .json({ success: false, message: "User cant be found in our system" });
    }
    const { emailverified } = results[0];
    if (emailverified === "yes") {
      return res
        .status(200)
        .json({ success: true, message: "Email successfully verified" });
    } else {
      return res
        .status(200)
        .json({ success: false, message: "Email Not verified" });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while verifying email",
    });
  }
}

module.exports = Checkverify;
