const executor = require("../../config/db.js");
require("dotenv").config();
const mydate = new Date();
const axios = require("axios");
const Gettime = require("../../services/time.js");
const { makePurchaseRequest, getUserData } = require("./prop.js");
const GetPricer = require("../../services/price/price.js");
const Vemail = require("../../services/emailverify.js");
const Points = require("../../services/points/points.js");
async function Buyelectric(req, res) {
  console.log(req.body)
  const { userid } = req.user;
  const { meternumber, type, phone, amount } = req.body;
  const datas = { meternumber, type, phone, amount };
  const realamount = parseInt(amount, 10);
  if (!meternumber || !type || !phone || !amount) {
    return res.status(400).json({
      message: "All fields are required",
      success: false,
    });
  }
  console.log(req.body);
  try {
    console.log("Request Data:", datas);
    const requesttime = Gettime();
    console.log("Request Time:", requesttime);
    const userData = await getUserData(userid);
    const electricresponse = await GetPricer();
    if (!userData) {
      return res.status(404).json({
        message: "User Details not found, Contact support!",
        success: false,
      });
    }
    const emailverified = await Vemail(userid);
    if (emailverified === "no") {
      console.error("Account not verified");
      return res.status(401).json({ success: false, message: "Your email address has not been verified. Please verify your email address before proceeding with this transaction." });
    }
    if (!electricresponse) {
      return res.status(404).json({
        message: "Unable to verify charge amuount, Contact support!",
        success: false,
      });
    }
    const { electricprice } = electricresponse[0];
    const { credit, email } = userData;
    if (!electricprice) {
      return res.status(404).json({
        message: "Unable to verify charge amount, Contact support!",
        success: false,
      });
    };
    const intprice = parseInt(electricprice, 10);
    const intamount = intprice + realamount;
    const balance = parseInt(credit, 10);
    if (!balance || balance < intamount) {
      return res.status(402).json({
        message: "You have Insufficient balance to purchase this service",
        success: false,
      });
    } else if (balance >= intamount) {
      const responseData = await makePurchaseRequest({
        requesttime,
        meternumber,
        type,
        phone,
        amount: Number(amount) * 100,
        email
      });
      if (responseData.status) {
        const {
          pin,
          reference
        } = responseData.data;

        const imade = {
          userid,
          network: "Electricity",
          recipient: meternumber,
          Status: "successful",
          name: type,
          token: pin || "null",
          plan: reference,
          amount: intamount,
        };

        await setElectric(imade);
        await executor(
          "UPDATE users SET credit = credit - ? WHERE userid = ?",
          [intamount, userid]
        );
        Points(userid, amount, email)
        return res.status(200).json({
          message: `Your Electric Purchase Transaction was Successful and the token is ${pin || reference
            }`,
          success: true,
        });
      }
      else {
        return res.status(500).json({
          message: `Electricity Purchase Failed, Kindly Try Again later`,
          success: false,
        });
      }
    }
  } catch (error) {
    console.error("Error occurred:", error);
    const responsed = {
      message:
        "We apologize, we are currently unable to process your electricity plan purchase. Please try again later.",
      success: false,
      data: error,
    };
    res.status(500).json(responsed);
  }
}

const setElectric = async (data) => {
  const { userid, token, recipient, Status, network, plan, amount, name } =
    data;

  const newDate = new Date();
  const formattedDate = newDate.toISOString();
  try {
    const query = `INSERT INTO transactions (userid,recipient, name, status, price, date, network, token,plan,service) VALUES (?,?,?,?,?,?,?,?,?,?)`;
    executor(query, [
      userid,
      recipient,
      name,
      Status,
      amount,
      formattedDate,
      network,
      token,
      plan,
      "electric",
    ])
      .then((results) => {
        console.log("successful!", results);
      })
      .catch((error) => {
        console.warn("error setting transaction", mydate);
      });
  } catch (error) { }
};

module.exports = Buyelectric;
