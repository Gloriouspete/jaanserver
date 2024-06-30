const executor = require("../../config/db.js");

const Editdata = (req, res) => {
  const userid = req.user.userid;
  const { price ,planid} = req.body;
  console.log("Received phonenumber:", userid);
  const selectUserQuery = `UPDATE datatable SET price = ? where planid = ?`;
  executor(selectUserQuery, [price,planid])
    .then((results) => {
      return res.status(200).json({
        success: true,
        message: "Successfully Updated",
        data: results,
      });
    })
    .catch((error) => {
      console.error("Error finding user credentials:", error);
      return res.status(500).json({ error: "Internal server error" });
    });
};
module.exports = Editdata;
