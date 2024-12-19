const executor = require("../../config/db.js");
async function Manualfund(req, res) {
  const { email, amount, type } = req.body;
  const theamount = Number(amount);
  const userid = req.user.userid;
  try {
    const query = `SELECT * FROM users where email = ?`;
    const response = await executor(query, [email]);
    if (response.length === 0) {
      return res.status(402).json({
        success: true,
        message: "User Does not exist on the system",
        data: null,
      });
    }
    const { userid, phone } = response[0];
    let selectUserQuery;
    if (type === "credit") {
      selectUserQuery = `UPDATE users SET credit = credit + ${theamount} where email = ?`;
    } else if (type === "debit") {
      selectUserQuery = `UPDATE users SET credit = credit - ${theamount} where email = ?`;
    }

    if (type === "credit") {
      executor(selectUserQuery, [email])
        .then(async (results) => {
          const data = {
            userid,
            phone,
            deposit: "funding",
            Status: "successful",
            amount,
            date: gete(),
          };
          await setpayment(data);
          return res.status(200).json({
            success: true,
            message: "Transaction successfully completed",
            data: null,
          });
        })
        .catch((error) => {
          console.error("Error finding user credentials:", error);
          return res
            .status(500)
            .json({ success: false, message: "Unable to fund" });
        });
    }
    else{
      return res.status(200).json({
        success: true,
        message: "Transaction successfully completed",
        data: null,
      });
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Unable to fund " });
  }
}

const setpayment = async (data) => {
  const { userid, phone, deposit, Status, amount } = data;
  const today = new Date();
  const create_date = today.toISOString()
  try {

    const query = `INSERT INTO transactions(userid,recipient, service, status, price, date,name) VALUES (?,?,?,?,?,?,?)`;
    const results = await executor(query, [
      userid,
      phone,
      deposit,
      Status,
      amount,
      create_date,
      "Manual funding"
    ]);
    console.log("successful!", results);
    return true;
    // Assuming you want to return the results
  } catch (error) {
    console.log("error setting transaction");
    throw error; // Re-throw the error to propagate it
  }
};
const gete = () => {
  const date = new Date();

  const thedate = date.toISOString();
  return thedate;
};

module.exports = Manualfund;
