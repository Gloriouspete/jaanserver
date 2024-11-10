const axios = require("axios");
require("dotenv").config();
const mydate = new Date();
const apiKey = process.env.DATA_SECRET;
const GetKuda = require("./services/kuda.js"); // i USE THIS TO GET THE ACCESSTOKEN USING MY API KEYS
const Gettime = require("./services/time.js"); // REFERENCE GENERATOR
async function MakeTestRequest() {
  try {
    // const accesstoken = await GetKuda(); // Returns my accesstoken for each requests
    // if (!accesstoken) {
    //   return;
    // }
    const data = JSON.stringify({
      "cablename": "2",
      "cableplan": 21,
      "smart_card_number": 8214878279
    });
    const payload = {
      serviceType: "GET_BILLERS_BY_TYPE",
      requestRef: Gettime(),
      data: {
        "BillTypeName": "cabletv",
      },
    };

    const response = await axios.post(`https://datastation.com.ng/api/cablesub/`, data, {
      headers: {
        "Authorization": `Token ${apiKey}`,
        "Content-Type": "application/json"
      },
    });

    //console.log("see response:", response.data);
    const mydata = response.data;
    console.log(mydata);
    // This is the part where i receive the error response, Indicates that the response is directly from Kuda
  } catch (error) {
    // Unnecessary Part, it never gets here
    console.log(error);
    console.error("Error:", error.response);
  }
}

MakeTestRequest();
