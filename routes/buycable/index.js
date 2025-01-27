const executor = require("../../config/db.js");
require("dotenv").config();
const mydate = new Date();
const Gettime = require("../../services/time.js");
const GetPricer = require("../../services/price/price.js");
const { makePurchaseRequest, getUserData } = require("./prop.js");
const Vemail = require("../../services/emailverify.js");
const Confirmcable = require("./verify.js");
async function Buycable(req, res) {
  let deductedAmount = 0;
  const { userid } = req.user;
  const { billersCode, serviceID, variation_code, phone } = req.body;
  try {
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
        message: "Oops! Your transaction could not be completed. Please try again.",
        success: false,
      });
    }
    const { cableprice } = cableresponse[0];
    const amount = await Confirmcable(serviceID, variation_code, cableprice)
    if (!amount || amount === undefined) {
      return res.status(403).json({
        message: "Oops! Your transaction could not be completed. Please try again.",
        success: false,
      });
    }
    const { credit, email } = userData;
    const balance = parseInt(credit, 10);
    if (!balance || balance < amount) {
      return res.status(402).json({
        message: "You don't have enough balance to complete this transaction.",
        success: false,
      });
    }
    await executor("UPDATE users SET credit = credit - ? WHERE userid = ?", [
      amount,
      userid,
    ]);
    deductedAmount = amount;
    const responseData = await makePurchaseRequest({ requesttime, billersCode, serviceID, variation_code, phone });
    if (responseData.code === "000") {
      const {
        content: {
          transactions: { unique_element, phone, product_name },
        },
        response_description,
        type,
      } = responseData;

      const imade = {
        userid,
        network: serviceID,
        recipient: unique_element || phone,
        Status: "successful",
        name: product_name,
        token: response_description,
        plan: type,
        amount: amount,
      };
      await setCable(imade);
      return res.status(200).json({
        message: `Your ${serviceID} Cable Purchase Transaction of ${amount} was Successful`,
        success: true,
      });
    } else if (responseData.code === "099") {
      return res.status(500).json({
        message: `Cable Purchase is processing, Kindly contact support with the code ${requesttime} `,
        success: true,
      });
    } else {
      await executor("UPDATE users SET credit = credit + ? WHERE userid = ?", [
        deductedAmount,
        userid,
      ]);
      return res.status(500).json({
        message: `Cable Purchase Failed, Kindly Try Again later ${responseData.code}`,
        success: false,
      });
    }

  } catch (error) {
    await executor("UPDATE users SET credit = credit + ? WHERE userid = ?", [
      deductedAmount,
      userid,
    ]);
    console.error("Error occurred:", error);
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
