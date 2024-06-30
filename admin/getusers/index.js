const executor = require("../../config/db.js");
require("dotenv").config();

const Getusers = (req, res) => {
  const userid = req.user.userid;
  console.log("Received phonenumber:", userid);

  const selectUserQuery = "SELECT * FROM users";
  executor(selectUserQuery, [])
    .then((results) => {
      const transform = [];
      const resu = results.reverse();
      resu.forEach((element) => {
        transform.push(element);
      });
      console.log(transform, "see data o");
      return res.status(200).json({
        success: true,
        message: "This Admin not found",
        data: transform,
      });
    })
    .catch((error) => {
      console.error("Error finding user credentials:", error);
      return res.status(500).json({ error: "Internal server error" });
    });
};

module.exports = Getusers;
