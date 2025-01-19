const executor = require("../../config/db.js");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../../email.js");
require("dotenv").config();
const secretKey = process.env.SECRET;
async function Genemail(req, res) {
  const { userid } = req.user;
  try {
    const selectUserQuery = "SELECT * FROM users WHERE userid = ?";
    const results = await executor(selectUserQuery, [userid]);
    if (results.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User details Can't be found",
      });
    }
    const user = results[0];
    const { email, emailverified, name } = user;
    if (emailverified === "yes") {
      return res.status(200).json({
        success: false,
        message: "Your Account is already email verified!",
      });
    };

    const hashedemail = jwt.sign({ email }, secretKey);
    const hashedlink = `https://jaan.ng/verifyemail?q=${hashedemail}`;
    console.error(email,name,hashedlink,hashedemail)
    await sendVerificationEmail(email, name, hashedlink);
    res.status(200).json({
      success: true,
      message:
        "A verification link has been sent to your email, Please wait for at least 15 Minutes before requesting for another",
      data: null,
    });
  } catch (error) {
    console.error(error.response, "Error finding user credentials:");
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
}

module.exports = Genemail;
