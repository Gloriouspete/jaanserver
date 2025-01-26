const executor = require("../../config/db.js");
require("dotenv").config();

const Createmessage = (req, res) => {
  const { text } = req.body;
  const thedate = new Date();
  const newdate = thedate.toISOString();
  try {
    const messageQuery = `UPDATE message SET text = ?, status = 'active', ticker = ? ,date = ? where id = 1`;
    executor(messageQuery, [text,newdate, newdate]).then((phoneResults) => {
      res
        .status(200)
        .json({ success: true, message: "Successful created a Popup message" });
    });
  } catch (error) {
    console.error("Error during message popup creation:", error);
    res
      .status(500)
      .json({ success: false, messsage: "Error during PIN code creation" });
  }
};

module.exports = Createmessage;
