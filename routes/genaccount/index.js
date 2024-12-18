const executor = require("../../config/db.js");
const getAccount = require("../../account.js");
async function Genaccount(req, res) {
  const { type, number } = req.body;
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
    getAccount(userid, email, name, phone, type, number)
      .then(async (results) => {
        // const mydata = results.data;
        // const { bankname: bankName, accountnumber: accountNumber, accountname: accountName } = mydata;
        // const fact = await setBank(bankName, accountNumber, accountName, userid);
        if (results) {
          res.status(200).json({
            success: true,
            message: results || "A new bank account has been generated for you ",
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
            error || "We're currently unable to generate an account for you, please try again later",
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

const setBank = async (bankname, accountnumber, name, userid) => {
  try {
    const customerbankname = name;
    const query = `UPDATE users SET bankname = ? , accountnumber = ?, accountname = ? where userid = ?`;
    executor(query, [bankname, accountnumber, customerbankname, userid]).then((response) => {
      return true;
    });
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = Genaccount;
