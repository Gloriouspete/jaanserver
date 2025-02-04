const executor = require("../../config/db.js");
require("dotenv").config();
const mydate = new Date();
const apiKey = process.env.DATA_SECRET;

const axios = require("axios");
const Gettime = require("../../services/time.js");

async function makePurchaseRequest({
  cableid,
  planid,
  cardnumber
}) {
  const data = JSON.stringify({
    "cablename": cableid,
    "cableplan": planid,
    "smart_card_number": cardnumber
  });

  try {
    const response = await axios.post(`https://datastation.com.ng/api/cablesub/`, data, {
      headers: {
        "Authorization": `Token ${apiKey}`,
        "Content-Type": "application/json"
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
    const [userData] = await executor(
      "SELECT credit,email,ban FROM users WHERE userid = ?",
      [userid]
    );
    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("Error fetching user data");
  }
}

module.exports = { makePurchaseRequest, getUserData };



