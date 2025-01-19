require("dotenv").config();
const API_KEY = process.env.MONNIFY_CLIENT;
const SECRET_KEY = process.env.PAYSTACK_SECRET;
const axios = require("axios");
const getAccount = async (userid, email, username, phone, type, number) => {

  try {
    const url =
      "https://api.paystack.co/dedicated_account/assign";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SECRET_KEY}`,
    };

    let requestBody;

    requestBody = {
      customer: userid,
      phone,
      email,
      first_name: username,
      last_name: username,
      country: "NG",
      preferred_bank: "titan-paystack",
    };

    if (type === "bvn") {
      requestBody.bvn = number
    } else {
      requestBody.nin = number
    }

    const response = await axios.post(url, requestBody, { headers });
    const responseData = response.data;
    console.log(responseData);

    if (responseData.status) {
      // const bankname = responseData.data.bank.name;
      // const accountname = responseData.data.account_name;
      // const accountnumber = responseData.data.account_number;
      // const accounts = {
      //   bankname,
      //   accountname,
      //   accountnumber
      // }
      // const result = {
      //   success: true,
      //   data: accounts,
      // };
      return responseData.message;
    } else {
      throw new Error("Error creating account");
    }
  } catch (error) {
    console.error(error.response ? error.response.data.message : error.message);
    const newmessage = error.response ? error.response.data.message : error.message;
    throw newmessage;
  }
};


module.exports = getAccount
