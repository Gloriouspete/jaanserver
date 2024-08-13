const executor = require("../../config/db.js");
require("dotenv").config();
const mydate = new Date();
const apiKey = process.env.VT_LIVE_API;
const secretKey = process.env.VT_LIVE_SECRET;
const axios = require("axios");
const Gettime = require("../../services/time.js");


async function makePurchaseRequest({ requesttime, billersCode, serviceID, variation_code, phone, amount }) {
    const data = {
      request_id: requesttime,
      billersCode: billersCode,
      serviceID: serviceID.toString(),
      variation_code: variation_code.toString(),
      phone: phone.toString(),
      amount: amount.toString(),
    };
  
    try {
      const response = await axios.post(`https://api-service.vtpass.com/api/pay`, data, {
        headers: {
          "api-key": apiKey.trim(),
          "secret-key": secretKey.trim(),
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error making purchase request:", error);
      throw new Error("Error making purchase request");
    }
  }
  async function getUserData(userid) {
    try {
      const [userData] = await executor("SELECT credit FROM users WHERE userid = ?", [userid]);
      return userData;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw new Error("Error fetching user data");
    }
  }
  

  module.exports = {makePurchaseRequest,getUserData}