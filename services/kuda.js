const axios = require("axios");
require("dotenv").config();
const kudaapi = process.env.KUDA_API;

async function GetKuda() {
  try {
    const payload = {
      email: "payments@jaan.ng",
      apiKey: kudaapi,
    };

    // Here I'm sending a post request to get the token
    const response = await axios.post(
      "https://kuda-openapi-uat.kudabank.com/v2.1/Account/GetToken",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if(response.data){
      // The response is mostly received successfully so i do not have an issue with this part
      return response.data;
    }
    else {
      return false
    }
  } catch (error) {
    console.error(error)
    console.error(
      "Errors:",
      error.response.data 
    );
  }
}

module.exports = GetKuda;