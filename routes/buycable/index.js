const executor = require("../../config/db.js");
require("dotenv").config();
const mydate = new Date();
const Gettime = require("../../services/time.js");
const GetPricer = require("../../services/price/price.js");
const { makePurchaseRequest, getUserData } = require("./prop.js")
async function Buycable(req, res) {
  const { userid } = req.user;
  const { billersCode, serviceID, variation_code, phone, amount } = req.body;
  const realamount = parseInt(amount, 10);

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
    if (!cableresponse) {
      return res.status(404).json({
        message: "Unable to verify charge amuount, Contact support!",
        success: false,
      });
    }
    const { cableprice } = cableresponse[0];


    const { credit } = userData;
    const intprice = parseInt(cableprice, 10);
    const intamount = intprice + realamount;
    const balance = parseInt(credit, 10);
    if (!balance || balance < intamount) {
      return res.status(402).json({
        message: "You have Insufficient balance to purchase this service",
        success: false,
      });
    } else if (balance >= intamount) {
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
          amount:intamount,
        };

        await setCable(imade);
        await executor("UPDATE users SET credit = credit - ? WHERE userid = ?", [
          intamount,
          userid,
        ]);

        return res.status(200).json({
          message: `Your Cable Purchase Transaction was Successful`,
          success: true,
        });
      } else if (responseData.code === "099") {
        return res.status(500).json({
          message: `Cable Purchase is processing, Kindly contact support with the code ${requesttime} `,
          success: true,
        });
      } else {
        return res.status(500).json({
          message: `Cable Purchase Failed, Kindly Try Again later ${responseData.code}`,
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
  } catch (error) {}
};

module.exports = Buycable;
