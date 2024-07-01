const executor = require("../../config/db.js");
const getAccount = require("../../account.js");
async function Genaccount(req, res) {
  const { userid } = req.user;
  console.log("Received phonenumber:", userid);
  try {
    const selectUserQuery = "SELECT * FROM users WHERE userid = ?";
    const results = await executor(selectUserQuery, [userid]);
    if (results.length === 0) {
      return res.status(200).json({
        success: false,
        message: "User details Can't be found",
      });
    }
    const user = results[0];
    const { email, phone, name } = user;
    getAccount(userid, email, name)
      .then(async (results) => {
        const mydata = results.data;
        const { bankName, accountNumber } = mydata;
        const fact = await setBank(bankName, accountNumber, userid);
        if (fact) {
          res.status(200).json({
            success: true,
            message: "A new bank account has been generated for you ",
            data: null,
          });
        } else
          res.status(200).json({
            success: false,
            message: "Currently unable to generate a bank account for you",
            data: user,
          });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({
          success: false,
          message:
            "We're currently unable to generate an account for you, please try again later",
          data: null,
        });
      });
  } catch (error) {
    console.error(error.response, "Error finding user credentials:");
    return res
      .status(500)
      .json({ success: false, message: "Unable to generate your account" });
  }
}

const setBank = async (bankname, accountnumber, userid) => {
  try {
    const query = `UPDATE users SET bankname = ? , accountnumber = ? where userid = ?`;
    executor(query, [bankname, accountnumber, userid]).then((response) => {
      return true;
    });
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = Genaccount;
