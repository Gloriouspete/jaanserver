require("dotenv").config;
const axios = require("axios");
const apiKey = process.env.VT_LIVE_API;
const secretKey = process.env.VT_LIVE_SECRET;
const datasecret = process.env.SECRET;
const Gettime = require("./services/time.js");

async function Getelectric(req, res) {
  const load = {
    serviceID: "benin-electric",
    billersCode: "04234760439",
    type:"prepaid"
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
