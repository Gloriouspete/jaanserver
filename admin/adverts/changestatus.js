const executor = require("../../config/db.js");
require("dotenv").config();

const ChangeAdvertStatus = (req, res) => {
  const { id, status } = req.body;
  try {
    const messageQuery = `UPDATE ad_banner SET active = ? where id = ?`;
    executor(messageQuery, [status === "active" ? "1" : "0", id]).then((phoneResults) => {
      res
        .status(200)
        .json({ success: true, message: "Successful changed the advert status" });
    });
  } catch (error) {
    console.error("Error during changing advert status", error);
    res
      .status(500)
      .json({ success: false, messsage: "Internal server error, Unable to change advert status" });
  }
};

module.exports = ChangeAdvertStatus;
