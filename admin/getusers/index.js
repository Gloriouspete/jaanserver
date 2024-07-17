const executor = require("../../config/db.js");
require("dotenv").config();

const Getusers = (req, res) => {
  const userid = req.user.userid;
  console.log("Received phonenumber:", userid);

  const selectUserQuery = "SELECT * FROM users ORDER BY id DESC";
  executor(selectUserQuery, [])
    .then((results) => {
      return res.status(200).json({
        success: true,
        message: "This Admin not found",
        data: results
      });
    })
    .catch((error) => {
      console.error("Error finding user credentials:", error);
      return res.status(500).json({ error: "Internal server error" });
    });
};

module.exports = Getusers;
