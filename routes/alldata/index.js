const executor = require("../../config/db.js");
require("dotenv").config();
const datasecret = process.env.DATA_SECRET;
const axios = require("axios");
const NodeCache = require("node-cache");
const Points = require("../../services/points/points.js");
const Vemail = require("../../services/emailverify.js");
const { check, validationResult } = require("express-validator");
const { makePurchaseRequest } = require("./prop.js");
const { MaximumTran } = require("../../services/worker.js");

const myCache = new NodeCache();
async function BuyAlldata(req, res) {
  const userid = req.user.userid;
  let deductedAmount = 0
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Input Sanitization Failed, Check the Inputs value"
    });
  }

  try {
    const { network, netcode, dataplan, number, dataAmount, pincode } = req.body;

    const lockExists = myCache.get(`datatransactionLocks:${userid}`);
    if (lockExists) {
      console.log("Transaction in progress");
      return res.status(200).json({
        success: false,
        message: "Too Many Requests",
        data: null,
      });
    }
    myCache.set(`datatransactionLocks:${userid}`, "locked", 10);
    const [userData] = await executor(
      "SELECT * FROM users WHERE userid = ?",
      [userid]
    );
    if (!userData) {
      return res.status(404).json({ success: false, message: "Account not found" });
    }
    const emailverified = await Vemail(userid);
    if (emailverified === "no") {
      return res.status(403).json({
        success: false,
        message: "Your email address has not been verified. Please verify your email before proceeding.",
      });
    }
    const { pin, phone, credit, email, verified, ban,business } = userData;
    const mypin = parseInt(pin, 10);
    const balance = parseInt(credit, 10);
    if (ban === "yes") {
      console.error("This user has been banned");
      return res
        .status(403)
        .json({
          success: false,
          message:
            "You have been banned from using Jaan services.",
        });
    }
    if (verified === "no") {
      console.error("identity not verified");
      return res.status(403).json({ success: false, message: "Your Kyc Account has not been verified. Please go to profile to verify your Identity before proceeding with this transaction." });
    }
    if (business === "no") {
      const maximumprice = await MaximumTran(userid)
      console.error("see maximun price", maximumprice)
      if (Number(maximumprice) >= 20000) {
        return res.status(403).json({
          success: false,
          message: "You have reached your maximum limit of 20,000 Naira for the day, Please upgrade to Business for unlimited transaction",
          data: null,
        });
      }
    }

    const parsedAmount = Number(dataAmount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid data amount" });
    }
    const newbalance = balance - parsedAmount;
    if (newbalance < 0) {
      console.log("Insufficient funds");
      return res.status(400).json({
        success: false,
        message: "Insufficient Funds",
        data: null,
      });
    }
    await executor("UPDATE users SET credit = credit - ? WHERE userid = ?", [
      parsedAmount,
      userid,
    ]);
    deductedAmount = parsedAmount;
    const response = await makePurchaseRequest({
      requesttime: new Date(),
      serviceID: netcode,
      billersCode: number,
      variation_code: dataplan,
      phone
    })
    if (response.code === "000" || response.code === "099") {

      const newdate = new Date();
      const create_date = newdate.toISOString();
      const imade = {
        userid,
        recipient: number,
        Status: response.code === "000" ? "successful" : "pending",
        network: network,
        plan: dataplan,
        amount: parsedAmount,
        create_date,
      };
      await setData(imade);
      Points(userid, parsedAmount, email);
      return res.status(200).json({
        success: true,
        message: `Data Purchase Successful ${response.code === "000" ? "successful" : "pending"}`,
        data: null,
      });
    } else {
      await executor("UPDATE users SET credit = credit + ? WHERE userid = ?", [
        deductedAmount,
        userid,
      ]);
      return res.status(200).json({
        success: false,
        message: "Data Purchase Failed, Try again later",
        data: null,
      });
    }

  } catch (error) {
    await executor("UPDATE users SET credit = credit + ? WHERE userid = ?", [
      deductedAmount,
      userid,
    ]);
    console.error(error);
    res
      .status(500)
      .json({
        message: "Currently Unable to purchase data, kindly try agin later",
        success: false,
      });
  } finally {
    myCache.del(`datatransactionLocks:${userid}`);
  }
}

const setData = async (data) => {
  const { userid, recipient, Status, network, plan, amount, create_date } =
    data;

  try {
    const query = `INSERT INTO transactions (userid, recipient, status, price, date, network, plan,service) VALUES (?,?,?,?,?,?,?,?)`;
    executor(query, [
      userid,
      recipient,
      Status,
      amount,
      create_date,
      network,
      plan,
      "data",
    ])
      .then((results) => {
        // console.log("successful!", results);
      })
      .catch((error) => {
        // console.log("error setting transaction");
      });
  } catch (error) {
    console.log(error);
  }
};

module.exports = BuyAlldata;
