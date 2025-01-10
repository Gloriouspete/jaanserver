const executor = require("../../config/db.js");
require("dotenv").config();
const mydate = new Date();
const apiKey = process.env.VT_LIVE_API;
const secretKey = process.env.VT_LIVE_SECRET;
const axios = require("axios");
const Gettime = require("../../services/time.js");

async function makePurchaseRequest({
  requesttime,
  serviceID,
  billersCode,
  variation_code,
  phone,
}) {
  const data = {
    request_id: requesttime,
    billersCode,
    serviceID,
    variation_code,
    phone: phone,
  };
  console.error("This is the second one", data)
  try {
    const response = await axios.post(`https://vtpass.com/api/pay`, data, {
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
        "secret-key": secretKey,
      },
    });
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error making purchase request:", error);
    throw new Error("Error making purchase request");
  }
}
async function getUserData(userid) {
  try {
    const [userData] = await executor(
      "SELECT credit FROM users WHERE userid = ?",
      [userid]
    );
    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("Error fetching user data");
  }
}

module.exports = { makePurchaseRequest, getUserData };
