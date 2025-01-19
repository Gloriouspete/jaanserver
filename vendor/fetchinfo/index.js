//const executor = require("../../config/db.js");
const executor = require("../../config/db.js");
function FetchInfo(req, res) {
  const userid = req.user;

  executor.query("select * from users where userid = ?", [userid])
    .then((results) => {
      const user = results[0];
      res.status(200).json({
        success: true,
        message: "User details retrieved successfully",
        data: user,
      });
    })
    .catch((error) => {
      console.error(error.response, "Error finding user credentials:");
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    });
}

module.exports = FetchInfo;