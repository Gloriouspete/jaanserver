require("dotenv").config();
const axios = require("axios");
const apiKey = process.env.VT_SAND_API;
const secretKey = process.env.VT_SAND_SECRET;
const Gettime = require("./services/time.js")
async function Getelectric(req, res) {
  const requesttime = Gettime();
  const load = {
    "request_id":requesttime,
    serviceID: "ikeja-electric",
    billersCode: "1111111111111",
    variation_code: "prepaid",
    amount: 500,
    phone: "09023469927",
  };
  try {
    const response = await axios.post(
      "https://sandbox.vtpass.com/api/pay",
      load,
      {
        headers: {
          "api-key": apiKey,
          "secret-key": secretKey,
        },
      }
    );
    const mydata = response.data;
    
    console.log("check me", mydata);
  } catch (error) {
    console.error(error);
  }
}

Getelectric();
