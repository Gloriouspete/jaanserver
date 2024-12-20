const executor = require("../../config/db");

const paymentSuccess = async (eventData) => {
  try {
    const data = eventData.data;
    const amount = data.fees_breakdown.amount;
    const email = data.customer.email;
    const query = `SELECT phone, credit, userid FROM users WHERE email = ?`;
    const results = await executor(query, [email]);
    if (results.length === 0) {
      throw new Error("User not found");
    }
    const user = results[0];
    const { phone, userid } = user;
    const parsedAmount = parseInt(amount, 10);
    let amountToCredit = parsedAmount;
    if (parsedAmount <= 500) {
      amountToCredit = parsedAmount * 0.9;
    } else {
      amountToCredit = parsedAmount - 50;
    }
    const anotherquery = `UPDATE users SET credit = credit + ? WHERE userid = ?`;
    await executor(anotherquery, [amountToCredit, userid]);
    const deposit = "Funding";
    const Status = "successful";
    const newdate = new Date();
    const create_date = newdate.toISOString();
    const imade = { userid, phone, deposit, Status, amount, create_date };
    await setpayment(imade);
    return Status;
  } catch (error) {
    console.error("Error in paymentSuccess:", error);
    return "failed";
  }
};

module.exports = paymentSuccess;

const setpayment = async (data) => {
  const { userid, phone, deposit, Status, amount, create_date } = data;

  try {
    const query = `INSERT INTO transactions(userid,recipient, service, status, price, date,name) VALUES (?,?,?,?,?,?,?)`;
    const results = await executor(query, [
      userid,
      phone,
      deposit,
      Status,
      amount,
      create_date,
      "Bank funding",
    ]);
    console.log("successful!", results);
    // Assuming you want to return the results
  } catch (error) {
    console.log("error setting transaction");
    throw error; // Re-throw the error to propagate it
  }
};