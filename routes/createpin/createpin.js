const executor = require("../../config/db.js");
function Createpin(req, res) {
  const { pincode } = req.body;
  const userid = req.user.userid;
  // console.log("check user id out", userid);
  try {
    const phoneQuery =
      "SELECT COUNT(*) AS phoneCount FROM users WHERE userid = ?";
    executor(phoneQuery, [userid]).then((phoneResults) => {
      const phoneCount = phoneResults[0].phoneCount;
      // console.log("check phonecount out", phoneCount);

      if (phoneCount > 0) {
        const insertPinQuery = "UPDATE users SET pin = ? WHERE userid = ?";
        executor(insertPinQuery, [pincode, userid]).then(() => {
          // console.log("PIN code added successfully");
          res.status(200).json({success:true, message: "successfully updated Pin" });
        });
      } else {
        // console.log("The phone number does not exist");
        res.status(200).json({success:false, message: "Unable to set Pin" });
      }
    });
  } catch (error) {
    // console.error("Error during PIN code creation:", error);
    res.status(500).send("Error during PIN code creation");
  }
}
module.exports = Createpin;

