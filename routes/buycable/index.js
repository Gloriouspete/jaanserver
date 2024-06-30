const executor = require("../../config/db.js");
require("dotenv").config();
const datasecret = process.env.DATA_SECRET;
const axios = require("axios");
async function Buycable(req, res) {
  // console.log("git here");
  const { userid } = req.user;
  const { billersCode, serviceID, variation_code, phone, amount } = req.body;
  const intamount = parseInt(amount, 10);
  try {
    const [userData] = await executor(
      "SELECT phonenumber, accountbalance FROM appusers WHERE userid = ?",
      [userid]
    );
    if (!userData) {
      // console.error("Account not found");
      return res
        .status(404)
        .json({ message: "User authentication failed, Contact support", success: false });
    }
    const { phonenumber, accountbalance } = userData;
    const balance = parseInt(accountbalance, 10);
    if (balance < intamount) {
      // console.log("no money");
      return res.status(402).json({
        message: "You have Insufficient balance to purchase this plan",
        success: false,
      });
    } else if (balance >= intamount) {
      let data = JSON.stringify({
        billersCode: billersCode,
        serviceID: serviceID,
        variation_code: variation_code,
        phone: phone,
        amount: amount,
      });

      // console.log(data);
      const response = await axios.post(
        `https://api.connectvaluedataservice.com/api/v1/transactions/cable/subscribe-cable`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${datasecret}`,
          },
        }
      );
      const responseData = response.data;
      // console.log(responseData);

      if (responseData.success === true) {
        const newbalance = balance - intamount;
        const { phone:recipient, platform:network, plan, created_at } =
          responseData.data.service;

        const imade = {
          userid,
          phonenumber,
          recipient,
          Status: "Success",
          network,
          plan,
          intamount,
          created_at,
        };
        await setCable(imade);
        await executor(
          "UPDATE appusers SET accountbalance = ? WHERE userid = ?",
          [newbalance, userid]
        );
        return res.status(200).json({
          message: `Your ${serviceID} plan Purchase was Successful`,
          success: true,
        });
      } else {
        return res.status(200).json({
          message: `${serviceID} plan Purchase Failed, Kindly Try Again later`,
          success: false,
        });
      }
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: `We apologize, but we’re currently unable to process your ${serviceID} plan purchase. Please try again later.`,
      success: false,
    });
  }
}

const setCable = async (data) => {
  const {
    userid,
    phonenumber,
    recipient,
    Status,
    network,
    plan,
    intamount,
    created_at,
  } = data;

  const parsedDate = new Date(created_at);
  const formattedDate = `${parsedDate.getFullYear()}-${(
    parsedDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${parsedDate.getDate().toString().padStart(2, "0")} 
        ${parsedDate.getHours().toString().padStart(2, "0")}:${parsedDate
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${parsedDate.getSeconds().toString().padStart(2, "0")}`;

  try {
    const query = `INSERT INTO transactions (userid,phonenumber, buynumber, status, price, date, network, size,service) VALUES (?,?,?,?,?,?,?,?,?)`;
    executor(query, [
      userid,
      phonenumber,
      recipient,
      Status,
      intamount,
      formattedDate,
      network,
      plan,
      "cable"
    ])
      .then((results) => {
         console.log("successful!", results);
      })
      .catch((error) => {
        // console.log("error setting transaction");
      });
  } catch (error) {
     console.log(error);
  }
};

module.exports = Buycable;
