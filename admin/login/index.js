const executor = require("../../config/db.js");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET;

async function AdminLogin(req, res) {
  try {
    const { username, password } = req.body;
    console.log("check number");
    const query = `SELECT userid, password FROM admin WHERE username = ?`;
    const results = await executor(query, [username]);

    if (results.length === 0) {
      console.log("can't find the admin");
      return res.status(200).json({
        success: false,
        message: "This Admin not found",
        data: null,
      });
    }

    const user = results[0];
    const { userid } = user;
    console.log("check number");
    const userpassword = user.password.toString();
    const intpassword = password.toString();
    
    if (userpassword !== intpassword) {
      console.log("Incorrect password", intpassword, userpassword);
      return res.status(200).json({
        success: false,
        message: "This Password is Incorrect",
        data: null,
      });
    } else {
      console.log("check number");
      const token = jwt.sign({ userid }, secretKey);
      console.log("Redirecting");
      return res.status(200).json({
        success: true,
        message: "successful",
        data: token,
      });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = AdminLogin;
