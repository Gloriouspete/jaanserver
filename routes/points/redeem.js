const executor = require("../../config/db.js");
require("dotenv").config();
const NodeCache = require("node-cache");
const myCache = new NodeCache();
const Convertpoints = async (req, res) => {
  console.log("got here");
  const userid = req.user.userid;
  const { amount } = req.body;
  try {
    const lockExists = myCache.get(`pointsLocks:${userid}`);
    if (lockExists) {
      console.log("Existing Transaction in progress");
      return res.status(429).json({
        success: false,
        message: "Too Many Requests",
        data: null,
      });
    }

    myCache.set(`pointsLocks:${userid}`, "locked", 10);

    const [userData] = await executor(
      "SELECT pin, phone, credit,points FROM users WHERE userid = ?",
      [userid]
    );

    if (!userData || userData.length === 0) {
      console.error("Account not found");
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }
    if (!amount) {
      console.error("Amount invalid");
      return res
        .status(404)
        .json({ success: false, message: "Invalid request sent" });
    }

    const { user_name, phone, credit, points } = userData;

    const amountcc = Number(amount);
    if (amountcc < 100) {
      return res.status(404).json({
        success: false,
        message: "Minimum amount to convert is 100 points",
      });
    }

    if (Number(points) < amountcc) {
      return res.status(404).json({
        success: false,
        message: "You have insufficient points to convert",
      });
    } else {
      const updateBalanceAndPointsQuery =
        "UPDATE users SET credit = credit + ?, points = points - ? WHERE userid = ?";

      await executor(updateBalanceAndPointsQuery, [amountcc, amountcc, userid]);
      console.log("Updated Points into the database successfully");
      const newdate = new Date();
      const create_date = newdate.toISOString();
      const imade = {
        userid,
        recipient: phone,
        Status: "Successful",
        network: "points",
        plan: amount,
        amount,
        create_date,
      };
      await coupontran(imade);
      return res.status(200).json({
        message: `You have successfully converted your points to the amount of ${amount} naira`,
        success: true,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Points conversion failed",
      data: null,
    });
  }
};
const coupontran = async (data) => {
  const { userid, recipient, Status, network, plan, amount, create_date } =
    data;
  // console.log(data, "see data o");

  try {
    const query = `INSERT INTO transactions(userid , recipient, status, price, date, network,plan,service) VALUES (?,?,?,?,?,?,?,?)`;
    executor(query, [
      userid,
      recipient,
      Status,
      amount,
      create_date,
      network,
      plan,
      "points",
    ])
      .then((results) => {
        // console.log("successfully inserted into transaction");
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.warn(error);
  }
};

module.exports = Convertpoints;
