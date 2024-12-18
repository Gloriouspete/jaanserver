const executor = require("../../config/db.js");
require("dotenv").config();
const axios = require("axios");
const secretKey = process.env.RE_TEST_SECRET;


async function makePurchaseRequest({ requesttime, meternumber, type, phone, amount,email }) {

  const payload = {
    email: email,
    transactionRef: requesttime,
    name: "Test",
    customerId: meternumber,
    phoneNumber: phone,
    billPaymentProductId: type,
    amount: amount,

  };

  try {
    const response = await axios.post(
      "https://api-demo.systemspecsng.com/services/connect-gateway/api/v1/biller/initiate",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "secretKey": secretKey,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error making purchase request:", error);
    throw new Error("Error making purchase request");
  }
}
async function getUserData(userid) {
  try {
    const [userData] = await executor("SELECT credit,email FROM users WHERE userid = ?", [userid]);
    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("Error fetching user data");
  }
}


module.exports = { makePurchaseRequest, getUserData }