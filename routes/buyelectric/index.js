const executor = require("../../config/db.js");
require("dotenv").config();
const mydate = new Date();
const Gettime = require("../../services/time.js");
const { makePurchaseRequest, getUserData } = require("./prop.js");
const GetPricer = require("../../services/price/price.js");
const Vemail = require("../../services/emailverify.js");
const Points = require("../../services/points/points.js");
const NodeCache = require("node-cache");
const myCache = new NodeCache();

async function Buyelectric(req, res) {
  const { userid } = req.user;
  const { type, provider, meternumber, phone, amount } = req.body;
  const realamount = parseInt(amount, 10);
  if (!type || !provider || !meternumber || !phone || !amount) {
    return res.status(400).json({
      message: "All fields are required",
      success: false,
    });
  }
  try {
    const lockExists = myCache.get(`electrictransactionLocks:${userid}`);
    if (lockExists) {
      console.log("Transaction in progress");
      return res.status(429).json({
        success: false,
        message: "Too Many Requests",
        data: null,
      });
    }
    myCache.set(`electrictransactionLocks:${userid}`, "locked", 10);
    const requesttime = Gettime();
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
      return res.json({ success: false, message: "Your email address has not been verified. Please verify your email address before proceeding with this transaction." });
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
    }
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
        billersCode: meternumber,
        serviceID: provider,
        variation_code: type,
        phone,
        amount,
      });
      if (responseData.code === "000") {
        const {
          content: {
            transactions: { unique_element, phone, product_name },
          },
          Token,
          purchased_code,
          units,
        } = responseData;

        const imade = {
          userid,
          network: "Electricity",
          recipient: unique_element,
          Status: "successful",
          name: product_name,
          token: Token || purchased_code,
          plan: units,
          amount: intamount,
        };
        await executor(
          "UPDATE users SET credit = credit - ? WHERE userid = ?",
          [intamount, userid]
        );
        await setElectric(imade);
        Points(userid, intamount, email)
        return res.status(200).json({
          message: `Your Electric Purchase Transaction was Successful and the token is ${Token || purchased_code
            }`,
          success: true,
        });
      } else if (responseData.code === "099") {
        return res.status(500).json({
          message: `Electricity Purchase is processing, Kindly contact support with the code ${requesttime} `,
          success: true,
        });
      } else {
        return res.status(500).json({
          message: `Electricity Purchase Failed, Kindly Try Again later ${responseData.code}`,
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
  }finally{
    myCache.del(`electrictransactionLocks:${userid}`);
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
