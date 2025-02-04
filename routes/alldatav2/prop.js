const executor = require("../../config/db.js");
require("dotenv").config();
const mydate = new Date();
const apiKey = process.env.VT_LIVE_API;
const secretKey = process.env.VT_LIVE_SECRET;
const axios = require("axios");
const Gettime = require("../../services/time.js");
const GenerateHeader = require("../../services/generateHeader/index.js");

async function makePurchaseRequest({
  productId,
  providerId,
  value,
  beneficiaryTelephone,
  beneficiaryLastname,
  beneficiaryFirstname,
  buyerLastname,
  buyerFirstname,
  buyerEmail
}) {
  const header = await GenerateHeader()
  const load = {
    productId,
    providerId,
    value,
    valueCurrencyId: 160,
    valueCurrencyCode: 'NGN',
    transactionTitle: "Data Purchase",
    beneficiaryTelephone: beneficiaryTelephone,
    beneficiaryEmail: "contact@jaan.ng",
    beneficiaryLastname,
    beneficiaryFirstname,
    buyerLastname,
    buyerFirstname,
    buyerCountry: "Nigeria",
    buyerEmail
  }
  try {
    const response = await axios.post(
      `https://sandboxapi.vendifydigital.com/api/v1/orders`, load,
      {
        headers: header
      }
    );
    const mydata = response.data;
    console.log(mydata)
    return mydata;
  } catch (error) {
    console.error("Error making purchase request:", error);
    throw new Error("Unable to complete purchase request");
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
