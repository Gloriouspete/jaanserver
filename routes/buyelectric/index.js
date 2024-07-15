const executor = require("../../config/db.js");
require("dotenv").config();
const mydate = new Date();
const apiKey = process.env.VT_SAND_API;
const secretKey = process.env.VT_SAND_SECRET;
const axios = require("axios");
const Gettime = require("../../services/getTime.js");
async function Buyelectric(req, res) {
  const { userid } = req.user;
  const { billersCode, serviceID, variation_code, phone, amount } = req.body;
  const datas = { billersCode, serviceID, variation_code, phone, amount };
  const intamount = parseInt(amount, 10);

  try {
    const requesttime = Gettime();
    /*
    const [userData] = await executor(
      "SELECT credit FROM users WHERE userid = ?",
      [userid]
    );
    if (!userData) {
      return res
        .status(404)
        .json({
          message: "User Details not found, Contact support!",
          success: false,
        });
    }
    const {credit } = userData;
    const balance = parseInt(credit, 10);
    if (balance < intamount) {
      return res.status(402).json({
        message: "You have Insufficient balance to purchase this service",
        success: false,
      });
    } else if (balance >= intamount) {
  */
    let data = {
      request_id: `${requesttime}erf`,
      billersCode: 1111111111111,
      serviceID: serviceID,
      variation_code: variation_code,
      phone: phone,
      amount: amount,
    };
    const response = await axios.post(
      `https://sandbox.vtpass.com/api/pay`,
      data,
      {
        headers: {
          "api-key": apiKey,
          "secret-key": secretKey,
        },
      }
    );
    const responseData = response.data;
    console.log(responseData);
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
        amount,
      };

      await setElectric(imade);
      await executor("UPDATE users SET credit = credit - ? WHERE userid = ?", [
        intamount,
        userid,
      ]);
      return res.status(200).json({
        message: `Your Electric Purchase Transaction was Successful and the token is ${Token}`,
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
  
  } catch (error) {
    const responsed = {
      message:
        "We apologize, we are currently unable to process your electricity plan purchase. Please try again later.",
      success: false,
      data: error,
    };
    console.warn(error);
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
  } catch (error) {}
};

module.exports = Buyelectric;
