const executor = require("../../config/db.js");
require("dotenv").config();
const generateString = require("../../services/generateiD.js");
const Createadvert = async (req, res) => {
  const newString = generateString();
  const { url, imageurl } = req.body;
  const thedate = new Date();
  const newdate = thedate.toISOString();
  console.log(newString)
  try {
    const query = `SELECT * FROM ad_banner where imageurl = ?`;
    const response = await executor(query, [imageurl]);
    if (response && response.length > 0) {
      return res.status(402).json({
        success: false,
        message: "This Image Link already exists, You should probably delete the existing one",
        data: null
      })
    }
    const messageQuery = `INSERT INTO ad_banner (id ,url ,imageurl,active) VALUES(? ,? ,? ,?)`;
    executor(messageQuery, [newString, url, imageurl, "1"]).then((phoneResults) => {
      return res
        .status(200)
        .json({ success: true, message: "Successful created an Advert Link" });
    });
  } catch (error) {
    console.error("Error during message popup creation:", error);
    return res
      .status(500)
      .json({ success: false, messsage: "Unable to create this advert" });
  }
};

module.exports = Createadvert;
