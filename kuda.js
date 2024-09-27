const axios = require("axios");
require("dotenv").config();
const Get = require("./services/kuda.js");
const Gettime = require("./services/time.js");
async function Make() {
  try {
    const accesstoken = await Get(); // Returns my accesstoken for each requests
    if (!accesstoken) {
      return;
    }
    const payload = {
      serviceType: "GET_GIFT_CARD",
      requestRef: Gettime(),
      data:{}
    };

    const response = await axios.post(
      "https://kuda-openapi-uat.kudabank.com/v2.1",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accesstoken}`,
        },
      }
    );

    console.log("see response:", response.data);
    // This is the part where i receive the error response, Indicates that the response is directly from Kuda
  } catch (error) {
    // Unnecessary Part, it never gets here
    console.log(error);
    console.error(
      "Error:",
      error.response 
    );
  }
}

Make();
