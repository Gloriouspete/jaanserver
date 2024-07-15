const executor = require("../../config/db.js");
require("dotenv").config();
async function GetPopup(req, res) {
  try {
    const query = `SELECT * FROM message`;
    const response = await executor(query, []);
    console.log(response);
    res
      .status(200)
      .json({
        success: true,
        message: "successfully retrieved",
        data: response,
      });
  } catch (error) {
    console.log(error.response?.data);
    res.status(500).json({ success: false, message: "Failed to retrieve" });
  }
}
module.exports = GetPopup;
