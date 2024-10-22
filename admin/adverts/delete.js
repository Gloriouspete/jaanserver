const executor = require("../../config/db.js");
require("dotenv").config();
const DeleteAdvert = (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(403).json({
      success: false,
      message: "Input validation Failed",
      data: null
    })
  }
  try {
    const messageQuery = `DELETE FROM ad_banner where id = ?`;
    executor(messageQuery, [id]).then((phoneResults) => {
      res
        .status(200)
        .json({ success: true, message: "Successful Deleted the Advert" });
    });
  } catch (error) {
    console.error("Error during message popup deletion", error);
    res
      .status(500)
      .json({ success: false, messsage: "Error during Advert deletion" });
  }
};

module.exports = DeleteAdvert;
