const executor = require("../../config/db.js");
require("dotenv").config();
const mydate = new Date();
const axios = require("axios");
const Gettime = require("../../services/time.js");
const { makePurchaseRequest, getUserData } = require("./prop.js");
const GetPricer = require("../../services/price/price.js");
const Vemail = require("../../services/emailverify.js");
const Points = require("../../services/points/points.js");
async function Buybetting(req, res) {
  const { userid } = req.user;
  const { meternumber, type, amount,bettingname } = req.body;
  const datas = { meternumber, type, amount };
  const realamount = parseInt(amount, 10);
  if (!meternumber || !type || !amount) {
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
    const { credit, email, phone } = userData;

    const intamount = realamount;
    const balance = Number(credit);
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
      });
      if (responseData.status) {
        const {
          pin,
          reference
        } = responseData.data;

        const imade = {
          userid,
          network: "betting",
          recipient: meternumber,
          Status: "successful",
          name: bettingname,
          token: pin || "null",
          plan: reference,
          amount: intamount,
        };

        await setBetting(imade);
        await executor(
          "UPDATE users SET credit = credit - ? WHERE userid = ?",
          [intamount, userid]
        );
        Points(userid, amount, email)
        return res.status(200).json({
          message: `Your Betting Account has been successfully funded!`,
          success: true,
        });
      } else {
        return res.status(500).json({
          message: `Betting Account funding Failed, Kindly Try Again later`,
          success: false,
        });
      }
    }
  } catch (error) {
    console.error("Error occurred:", error);
    const responsed = {
      message:
        "We apologize, we are currently unable to process your betting account funding. Please try again later.",
      success: false,
      data: error,
    };
    res.status(500).json(responsed);
  }
}

const setBetting = async (data) => {
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
      "betting",
    ])
      .then((results) => {
        console.log("successful!", results);
      })
      .catch((error) => {
        console.warn("error setting transaction", mydate);
      });
  } catch (error) { }
};

module.exports = Buybetting;
