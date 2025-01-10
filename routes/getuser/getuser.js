const executor = require("../../config/db.js");

 function Getuser(req, res) {
  const { userid } = req.user;

  const selectUserQuery = "SELECT * FROM users WHERE userid = ?";
  executor(selectUserQuery, [userid])
    .then((results) => {
      const user = results[0];
      console.log(user);
      console.log("Redirecting",user);
      res.status(200).json({
        success: true,
        message: "User details retrieved successfully",
        data: user,
      });
    })
    .catch((error) => {
      console.error( error.response,"Error finding user credentials:");
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    });
}

module.exports = Getuser;