const executor = require("../../config/db.js");
require("dotenv").config();
const axios = require("axios");
const Gettime = require("../../services/time.js");
const GetKuda = require("../../services/kuda.js");


async function makePurchaseRequest({ requesttime, meternumber, type, phone, amount }) {

  const payload = {
    serviceType: "ADMIN_PURCHASE_BILL",
    requestRef: Gettime(),
    data: {
      CustomerFirstName: "Test",
      CustomerIdentifier: meternumber,
      PhoneNumber: phone,
      BillItemIdentifier: type,
      Amount: amount,
    },
  };

  try {
    const accesstoken = await GetKuda();
    const response = await axios.post(
      "https://kuda-openapi.kuda.com/v2.1",
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
    const [userData] = await executor("SELECT credit,email,phone FROM users WHERE userid = ?", [userid]);
    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("Error fetching user data");
  }
}


module.exports = { makePurchaseRequest, getUserData }