require("dotenv").config();
const axios = require("axios");
const apiKey = process.env.VT_SAND_API;
const secretKey = process.env.VT_SAND_SECRET;
const Gettime = require("./services/getTime.js")
async function Getelectric(req, res) {
  const load = {
    serviceID: "abuja-electric",
    billersCode: "1111111111111",
    type: "prepaid",
  };
  try {
    const response = await axios.post(
      "https://api-service.vtpass.com/api/merchant-verify",
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
