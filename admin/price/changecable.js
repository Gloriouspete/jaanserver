const executor = require("../../config/db.js");

const Editcable = (req, res) => {
  const { price} = req.body;

  const selectUserQuery = `UPDATE admin SET cableprice = ?`;
  executor(selectUserQuery, [price])
    .then((results) => {
      return res.status(200).json({
        success: true,
        message: "Successfully Updated",
        data: results,
      });
    })
    .catch((error) => {
      console.error("Error finding user credentials:", error);
      return res.status(500).json({ error: "Internal server error" });
    });
};
module.exports = Editcable;
