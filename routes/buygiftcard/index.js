const executor = require("../../config/db.js");
require("dotenv").config();
const mydate = new Date();
const Gettime = require("../../services/time.js");
const { makePurchaseRequest, getUserData } = require("./prop.js");
const GetPricer = require("../../services/price/price.js");
const Vemail = require("../../services/emailverify.js");
const Points = require("../../services/points/points.js");
async function Buygiftcard(req, res) {
  console.log(req.body);
  const { userid } = req.user;
  const { giftname, kudaIdentifier, email, amount, nairaAmount } = req.body;
  const datas = { giftname, kudaIdentifier, email, amount, nairaAmount }
  const realamount = parseInt(nairaAmount, 10);
  if (!giftname || !kudaIdentifier || !email || !amount || !nairaAmount) {
    return res.status(400).json({
      message: "All fields are required",
      success: false,
    });
  }
  console.log(req.body);
  try {
    console.log("Request Data:", datas);
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
      return res.status(401).json({ success: false, message: "Your email address has not been verified. Please verify your email address before proceeding with this transaction." });
    }
    if (!electricresponse) {
      return res.status(404).json({
        message: "Unable to verify charge amount, Contact support!",
        success: false,
      });
    }
    const { electricprice } = electricresponse[0];
    const { credit, email: useremail, phone, user_name } = userData;
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
        identifier: kudaIdentifier,
        email,
        amount,
        phone,
        name: user_name
      });
      if (responseData.status) {
        const {
          pin
        } = responseData.data;

        const imade = {
          userid,
          network: "giftcard",
          recipient: meternumber,
          Status: "successful",
          name: giftname,
          token: pin?.number || "null",
          plan: pin?.serial,
          amount: intamount,
          email: email
        };
        await setGiftcard(imade);
        await executor(
          "UPDATE users SET credit = credit - ? WHERE userid = ?",
          [intamount, userid]
        );
        Points(userid, amount, email)
        return res.status(200).json({
          message: `Your Giftcard Purchase Transaction was Successful and the pin is ${pin?.number}`,
          success: true,
        });
      } else {
        return res.status(500).json({
          message: `Giftcard Purchase Failed, Kindly Try Again later`,
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

const setGiftcard = async (data) => {
  const { userid, token, recipient, Status, network, plan, amount, name, email } =
    data;

  const newDate = new Date();
  const formattedDate = newDate.toISOString();
  try {
    const query = `INSERT INTO transactions (userid,recipient, name, status, price, date, network, token,plan,service,email) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
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
      "giftcard",
      email
    ])
      .then((results) => {
        console.log("successful!", results);
      })
      .catch((error) => {
        console.warn("error setting transaction", mydate);
      });
  } catch (error) { }
};

module.exports = Buygiftcard;
