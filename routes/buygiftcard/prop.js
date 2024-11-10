const executor = require("../../config/db.js");
require("dotenv").config();
const axios = require("axios");
const Gettime = require("../../services/time.js");
const GetKuda = require("../../services/kuda.js");


async function makePurchaseRequest({ requesttime, identifier, email, amount, phone, name }) {

  const payload = {
    serviceType: "ADMIN_BUY_GIFT_CARD",
    requestRef: Gettime(),
    data: {
      "BillerIdentifier": identifier,
      "RequestingCustomerEmail": email,
      "RequestingCustomerName": name,
      "RequestingCustomerMobile": phone,
      "ClientFeeCharge": 0,
      "Amount": amount, //In Dollars
      "TrackingReference": email
    },
  };

  try {
    const accesstoken = await GetKuda();
    const response = await axios.post(
      "https://kuda-openapi-uat.kudabank.com/v2.1",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accesstoken}`,
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
    const [userData] = await executor("SELECT credit,email,phone,user_name FROM users WHERE userid = ?", [userid]);
    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("Error fetching user data");
  }
}


module.exports = { makePurchaseRequest, getUserData }