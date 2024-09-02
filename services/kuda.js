const axios = require("axios");
require("dotenv").config();
const kudaapi = process.env.KUDA_API;

async function Get() {
  try {
    // Define the request payload
    const payload = {
      email: "payments@jaan.ng",
      apiKey: kudaapi,
    };

    // Send a POST request
    const response = await axios.post(
      "https://kuda-openapi.kuda.com/v2.1/Account/GetToken",
      payload,
      {
        headers: {
          "Content-Type": "application/json", // Ensure the Content-Type is set to application/json
        },
      }
    );

    // Log the response from the server
    
    if(response.data){
      return response.data;
    }
    else {
      return false
    }
  } catch (error) {
    // Handle errors (e.g., network issues, invalid responses)
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }
}

module.exports = Get;