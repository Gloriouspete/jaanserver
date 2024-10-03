const executor = require("../../config/db.js");
require("dotenv").config();
const datasecret = process.env.DATA_SECRET;
const axios = require("axios");
const NodeCache = require("node-cache");
const Points = require("../../services/points/points.js");
const Vemail = require("../../services/emailverify.js");
const { check, validationResult } = require("express-validator");

const myCache = new NodeCache();

const Airtime = async (req, res) => {
  const userid = req.user.userid;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error(errors.array());
    return res
      .status(400)
      .json({
        success: false,
        message: "Input Sanitization Failed, Check the inputs value",
      });
  }

  try {
    const { netcode, amount, number, pincode } = req.body;

    const lockExists = myCache.get(`airtransactionLocks:${userid}`);
    if (lockExists) {
      console.log("Existing Transaction in progress");
      return res.status(200).json({
        success: false,
        message: "Too Many Requests",
        data: null,
      });
    }

    myCache.set(`airtransactionLocks:${userid}`, "locked", 10);

    const [userData] = await executor(
      "SELECT pin, phone, credit FROM users WHERE userid = ?",
      [userid]
    );

    if (!userData) {
      console.error("Account not found");
      return res.json({ success: false, message: "Account not found" });
    }
    const emailverified = await Vemail(userid);

    if (emailverified === "no") {
      console.error("Account not verified");
      return res.json({
        success: false,
        message:
          "Your email address has not been verified. Please verify your email address before proceeding with this transaction.",
      });
    }

    const { pin: mypin, phone, credit, email, verified } = userData;

    if (verified === "no") {
      console.error("identity not verified");
      return res
        .status(401)
        .json({
          success: false,
          message:
            "Your Kyc Account has not been verified. Please go to profile to verify your Identity before proceeding with this transaction.",
        });
    }
    console.log("this is userdata", credit);

    if (mypin.toString() !== pincode.toString()) {
      console.log("Incorrect pin");
      return res.status(200).json({
        success: false,
        message: "Incorrect Pin",
        data: null,
      });
    }

    const balancc = Number(credit);
    const amountcc = Number(amount);
    const newbalance = balancc - amountcc;

    if (isNaN(balancc) || isNaN(amountcc)) {
      return res.status(400).json({
        success: false,
        message: "Invalid credit or amount value",
        data: null,
      });
    }

    if (amountcc > balancc) {
      return res.status(400).json({
        success: false,
        message: "Insufficient Balance",
        data: null,
      });
    }

    if (newbalance < 0 || newbalance === undefined) {
      console.log("Insufficient funds");
      return res.status(200).json({
        success: false,
        message: "Insufficient Balance",
        data: null,
      });
    }

    const authToken = datasecret;
    const data = {
      network: netcode,
      amount: amount,
      mobile_number: number,
      Ported_number: true,
      airtime_type: "VTU",
    };

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://datastation.com.ng/api/topup/",
      headers: {
        Authorization: `Token ${authToken}`,
        Accept: "application/json",
      },
      data: data,
    };

    const response = await axios(config);
    const responseData = response.data;

    const { mobile_number, Status, plan_network } = responseData;
    const newdate = new Date();
    const create_date = newdate.toISOString();
    const imade = {
      userid,
      recipient: mobile_number,
      Status,
      network: plan_network,
      amount,
      create_date,
    };

    await airtimetran(imade);

    if (responseData.Status === "successful") {
      await executor("UPDATE users SET credit = ? WHERE userid = ?", [
        newbalance,
        userid,
      ]);
      Points(userid, amount, email);
      return res.status(200).json({
        success: true,
        message: "Airtime Purchase Successful",
        data: null,
      });
    } else {
      console.error("External API error:", responseData.Status);
      return res.status(200).json({
        success: false,
        message: "Airtime Purchase Failed",
        data: null,
      });
    }
  } catch (error) {
    console.error(error.response?.data);
    return res.status(200).json({
      success: false,
      message: "Airtime Purchase Failed",
      data: null,
    });
  }
};

const airtimetran = async (data) => {
  const { userid, recipient, Status, network, amount, create_date } = data;
  // console.log(data, "see data o");

  try {
    const query = `INSERT INTO transactions(userid , recipient, status, price, date, network,service) VALUES (?,?,?,?,?,?,?)`;
    executor(query, [
      userid,
      recipient,
      Status,
      amount,
      create_date,
      network,
      "airtime",
    ])
      .then((results) => {
        // console.log("successfully inserted into transaction");
      })
      .catch((error) => {
        // console.log("error setting transaction");
      });
  } catch (error) {
    // console.log(error);
  }
};

module.exports = Airtime;
