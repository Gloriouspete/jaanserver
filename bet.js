const axios = require("axios");
require("dotenv").config();
const GetKuda = require("./services/kuda.js");
const Gettime = require("./services/time.js");
const dataapi = process.env.DATA_SECRET;
async function Make() {
  try {
    const accesstoken = await GetKuda(); // Returns my accesstoken for each requests
    if (!accesstoken) {
      return;
    }
    const payload = {
      serviceType: "GET_BILLERS_BY_TYPE",
      requestRef: Gettime(),
      data: {
        "BillTypeName": "electricity",
      },
    };

    const response = await axios.get(
      "https://datastation.com.ng/api/rechargepin/",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${dataapi}`,
        },
      }
    );

    const mydata = response.data;

    console.log("see response:", mydata);
    // const mydata = response.data.data;
    // const gift = mydata.giftCardData;
    // console.log(gift);
    // This is the part where i receive the error response, Indicates that the response is directly from Kuda
  } catch (error) {
    // Unnecessary Part, it never gets here
    console.log(error);
    console.error("Error:", error.response);
  }
}

Make();
