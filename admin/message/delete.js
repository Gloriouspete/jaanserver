const executor = require("../../config/db.js");
require("dotenv").config();

const Deletemessage = (req, res) => {
  try {
    const messageQuery = `UPDATE message SET text = ?, status = 'inactive' where id = 1`;
    executor(messageQuery, [""]).then((phoneResults) => {
      res
        .status(200)
        .json({ success: true, message: "Successful Deleted the Popup message" });
    });
  } catch (error) {
    console.error("Error during message popup deletion", error);
    res
      .status(500)
      .json({ success: false, messsage: "Error during popup deletion" });
  }
};

module.exports = Deletemessage;
