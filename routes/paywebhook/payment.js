const executor = require("../../config/db");

const paymentSuccess = async (eventData) => {
    console.error(eventData)
    try {
        const data = eventData.data;
        const amount = data.amount;
        const email = data.customer.email;
        const query = `SELECT phone, credit, userid FROM users WHERE email = ?`;
        const results = await executor(query, [email]);

        if (results.length === 0) {
            throw new Error("User not found");
        }
        const user = results[0];
        const { phone, credit, userid } = user;
        const balance = parseInt(credit, 10);
        const parsedAmount = parseInt(amount, 10);
        const plusedamount = balance + parsedAmount;
        const anotherquery = `UPDATE users SET credit = ? WHERE userid = ?`;
        await executor(anotherquery, [plusedamount, userid]);
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