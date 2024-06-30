const executor = require("../../config/db.js");
function Setpass(req, res) {
  const { password } = req.body;
  const userid = req.user.userid;
  const query = `UPDATE users set password = ? WHERE userid = ?`;
  executor(query, [password, userid])
    .then((results) => {
      if (results) {
        return res
          .status(200)
          .json({ success: true, message: "Password Successfully set" });
      }
    })
    .catch((error) => {
      return res
        .status(500)
        .json({ success: false, message: "Currently unable to proceed with this request" });
    });
}
module.exports = Setpass;
