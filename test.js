const axios = require("axios");
require("dotenv").config();
const GetKuda = require("./services/kuda.js");
const Gettime = require("./services/time.js");
async function Make() {
  try {
    const accesstoken = await GetKuda(); // Returns my accesstoken for each requests
    if (!accesstoken) {
      return;
    }
    const payload = {
      serviceType: "ADMIN_PURCHASE_BILL",
      requestRef: Gettime(),
      data: {
        CustomerFirstName: "Test",
        CustomerIdentifier: "07030000000",
        PhoneNumber: "07030000000",
        BillItemIdentifier: "KUD-BET-MSPT-001",
        Amount: "10000",
      },
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
// see response: {
//   message: 'Your bill purchase request is successful',
//   status: true,
//   data: { reference: '2024110111418886', pin: null },
//   statusCode: '00'
// }