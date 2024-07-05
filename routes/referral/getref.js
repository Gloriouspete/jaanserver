const executor = require("../../config/db.js");
async function GetReferrals(req, res) {
  const { userid } = req.user;
  try {
    const query = `SELECT refer_code FROM users WHERE userid = ?`;
    const results = await executor(query, [userid]);
    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Server authentication failed, Contact support",
      });
    }
    const { refer_code } = results[0];
    const secondquery = `SELECT name,email from users where refer_by = ?`;
    const response = await executor(secondquery, [refer_code]);
    if (response.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Successfully returned",
        data: response,
      });
    } else {
      return res.status(204).json({
        success: false,
        message: "No referrals yet",
      });
    }
  } catch (error) {
    console.error("Error finding user credentials:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching ads",
      error: "Internal server error",
    });
  }
}

module.exports = GetReferrals;