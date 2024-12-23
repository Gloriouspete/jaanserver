const executor = require("../../config/db.js");
require("dotenv").config();
const mydate = new Date();
const Gettime = require("../../services/time.js");
const GetPricer = require("../../services/price/price.js");
const { makePurchaseRequest, getUserData } = require("./prop.js");
const Vemail = require("../../services/emailverify.js");
const Points = require("../../services/points/points.js");
async function Buycable(req, res) {
  const { userid } = req.user;
  const { cableid, planid, cardnumber, cablename, phone, amount } = req.body;
  const realamount = parseInt(amount, 10);
  try {
    if (!cableid || !cardnumber || !cablename || !phone || !amount || !planid) {
      return res.status(402).json({
        message: "Unable to validate request, Please check details again!",
        success: false,
      });
    }
    const requesttime = Gettime();
    console.log("Request Time:", requesttime);
    const userData = await getUserData(userid);
    const cableresponse = await GetPricer()
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
    if (!cableresponse) {
      return res.status(404).json({
        message: "Unable to verify charge amount, Contact support!",
        success: false,
      });
    }
    const { cableprice } = cableresponse[0];
    const { credit, email, ban } = userData;
    const intprice = parseInt(cableprice, 10);
    const intamount = intprice + realamount;
    const balance = parseInt(credit, 10);
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
    if (!balance || balance < intamount) {
      return res.status(402).json({
        message: "You have Insufficient balance to purchase this service",
        success: false,
      });
    } else if (balance >= intamount) {
      const responseData = await makePurchaseRequest({ cableid, planid, cardnumber });
      const { package, cable } = responseData
      if (responseData.Status === "successful" || "pending" || "Pending") {
        const imade = {
          userid,
          network: cable,
          recipient: cardnumber,
          Status: responseData.Status,
          name: package,
          token: "null",
          plan: package,
          amount: intamount,
        };

        await setCable(imade);
        await executor("UPDATE users SET credit = credit - ? WHERE userid = ?", [
          intamount,
          userid,
        ]);
        Points(userid, amount, email)
        return res.status(200).json({
          message: `Your ${cablename} Purchase Transaction ${responseData.Status}`,
          success: true,
        });
      }
      else {
        return res.status(500).json({
          message: `Cable Purchase Failed, kindly try again later`,
          success: false,
        });
      }
    }
  } catch (error) {
    console.warn("Error occurred:", error);
    const responsed = {
      message: "We apologize, we are currently unable to process your cable plan purchase. Please try again later.",
      success: false,
      data: error,
    };
    res.status(500).json(responsed);
  }
}


const setCable = async (data) => {
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
      "cable",
    ])
      .then((results) => {
        console.log("successful!", results);
      })
      .catch((error) => {
        console.warn("error setting transaction", mydate);
      });
  } catch (error) { }
};

module.exports = Buycable;
