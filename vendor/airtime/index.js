const executor = require("../../config/db.js");
require("dotenv").config();
const datasecret = process.env.DATA_SECRET;
const axios = require("axios");
const NodeCache = require("node-cache");
const Points = require("../../services/points/points.js");
const { validationResult } = require("express-validator");
const networkMap = {
  mtn: '1',
  airtel: '4',
  glo: '2',
  '9mobile': '3',
};
const myCache = new NodeCache();

const VendAirtime = async (req, res) => {
  let deductedAmount = 0;
  const userid = req.user.userid;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error(errors.array());
    return res
      .status(400)
      .json({
        success: false,
        message: "Input Sanitization Failed, Bad parameters",
        error: errors.array()
      });
  }
  try {
    const { network, amount, number } = req.body;
    if (!network || typeof network !== 'string') {
      return res.status(400).json({
        success: false,
        message: "Bad request: 'netcode' parameter is missing or invalid.",
        data: null,
      });
    }
    const normalizedNetcode = network.toLowerCase();
    const netcode = networkMap[normalizedNetcode];
    if (!netcode) {
      return res.status(400).json({
        success: false,
        message: `Bad request: '${network}' is not a valid network code.`,
        data: null,
      });
    }
    const [userData] = await executor(
      "SELECT * FROM users WHERE userid = ?",
      [userid]
    );
    if (!userData) {
      console.error("Account not found");
      return res.json({ success: false, message: "Account not found" });
    }
    const { phone, credit, email, ban } = userData;
    if (ban === "yes") {
      console.error("This user has been banned");
      return res
        .status(401)
        .json({
          success: false,
          message:
            "You have been banned from using Jaan services.",
        });
    }
    const balancc = Number(credit);
    const amountcc = Number(amount) * 0.99;
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
    await executor("UPDATE users SET credit = credit - ? WHERE userid = ?", [
      amountcc,
      userid,
    ]);
    deductedAmount = amountcc;
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
      return res.status(200).json({
        success: true,
        message: "Airtime Purchase Successful",
        data: {
          recipient: mobile_number,
          status: Status,
          network: plan_network,
          date: create_date,
          amount,
          channel: "api"

        },
      });
    } else {
      await executor("UPDATE users SET credit = credit + ? WHERE userid = ?", [
        deductedAmount,
        userid,
      ]);
      console.error("External API error:", responseData.Status);
      return res.status(500).json({
        success: false,
        message: `Airtime Purchase Failed`,
        data: null,
      });
    }
  } catch (error) {
    const newdate = new Date();
    const create_date = newdate.toISOString();
    await executor("UPDATE users SET credit = credit + ? WHERE userid = ?", [
      deductedAmount,
      userid,
    ]);
    console.error(error.response?.data);
    return res.status(500).json({
      success: false,
      message: "Airtime Purchase Failed, Internal server error",
      data: {
        date: create_date
      },
    });
  } finally {
    myCache.del(`airtransactionLocks:${userid}`);
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

module.exports = VendAirtime;
