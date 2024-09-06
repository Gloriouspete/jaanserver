require("dotenv").config();
const axios = require("axios");
const apiKey = process.env.VT_SAND_API;
const secretKey = process.env.VT_SAND_SECRET;
const datasecret = process.env.SECRET;
const Gettime = require("./services/time.js");

async function Getelectric(req, res) {
  const load = {
    request_id: Gettime(),
    serviceID: "showmax",
    billersCode: "1212121212",
    variation_code: "full",
    phone: "09039968560",
    //amount: 500,
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
