require("dotenv").config();
const axios = require("axios");
const apiKey = process.env.VT_SAND_API;
const secretKey = process.env.VT_SAND_SECRET;
const Gettime = require("./services/time.js")
async function Getelectric(req, res) {
  const load = {
    "request_id":Gettime(),
    serviceID: "gotv",
    billersCode: "1212121212",
    variation_code:"gotv-max",
    phone:"09023469927",
    subsciption_type:"renew"
  };
  console.warn(load)
  try {
    const response = await axios.post(
      `https://sandbox.vtpass.com/api/pay`,load,
      {
        headers: {
          'Content-Type': 'application/json',
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
