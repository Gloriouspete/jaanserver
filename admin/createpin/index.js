const executor = require("../../config/db.js");
require("dotenv").config();

const Createpin = (req, res) => {
  const { pincode } = req.body;
  const userid = req.user.userid;
  try {
    // Check if the phone number exists
    const phoneQuery =
      "SELECT COUNT(*) AS phoneCount FROM appusers WHERE userid = ?";

    // Execute the query to count existing phone numbers
    executor(phoneQuery, [userid]).then((phoneResults) => {
      const phoneCount = phoneResults[0].phoneCount;
      console.log("check phonecount out", phoneCount);

      if (phoneCount > 0) {
        // If the phone number exists, insert the PIN code
        const insertPinQuery = "UPDATE appusers SET pin = ? WHERE userid = ?";

        // Execute the query to update the PIN code
        executor(insertPinQuery, [pincode, userid]).then(() => {
          console.log("PIN code added successfully");
          res.status(200).json({ message: "successful" });
        });
      } else {
        console.log("The phone number does not exist");
        res.status(200).json({ message: "notfound" });
      }
    });
  } catch (error) {
    console.error("Error during PIN code creation:", error);
    res.status(500).send("Error during PIN code creation");
  }
};

module.exports = Createpin;
