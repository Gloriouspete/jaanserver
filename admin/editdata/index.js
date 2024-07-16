const executor = require("../../config/db.js");

const Editprice = (req, res) => {
  const userid = req.user.userid;
  const { price ,plan} = req.body;
  let changeQuery;
  if(plan === "electric"){
    changeQuery = `update admin set electricprice = ? where username = 'Jaan'`
  }
  else if (plan === "cable"){
    changeQuery = `update admin set cableprice = ? where username = 'Jaan'`
  }


  executor(changeQuery, [price])
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
module.exports = Editprice;
