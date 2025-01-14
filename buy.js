require("dotenv").config();
const axios = require("axios");
const apiKey = process.env.VT_LIVE_API;
const secretKey = process.env.VT_LIVE_SECRET;
const Gettime = require("./services/time.js");
async function Getelectric(req, res) {
  const load = {
    request_id: Gettime(),
    serviceID: "benin-electric",
    billersCode: "04234760439",
    variation_code:"prepaid",
    amount:"500",
    phone:"09039968560"
  };
  
  try {
    const response = await axios.post(
      `https://api-service.vtpass.com/api/pay`,load,
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
          "secret-key": secretKey,
        },
      }
    );
    const mydata = response.data;
    console.log(mydata)
    // if (mydata && mydata.response_description === "000") {
    //   console.log(mydata.content.varations);
    // }
  } catch (error) {
    console.error(error);
  }
}

Getelectric();


