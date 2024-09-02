const axios = require("axios");
require("dotenv").config();
const Get = require("./services/kuda.js")
const Gettime = require("./services/time.js");
async function Make() {
  try {
    const accesstoken = await Get()
    const payload = {
      serviceType: "GET_GIFT_CARD",
      requestRef: Gettime(),
      // Data:{
      //   "BillTypeName":"electricity"
      // }
    };

    // Send a POST request
    const response = await axios.post(
      "https://kuda-openapi.kuda.com/v2.1",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization":`Bearer ${accesstoken}` // Ensure the Content-Type is set to application/json
        },
      }
    );

    // Log the response from the server
    console.log("see response:", response.data);
  } catch (error) {
    // Handle errors (e.g., network issues, invalid responses)
    console.log(error)
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }
}

Make()