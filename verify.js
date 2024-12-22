const axios = require("axios");
require("dotenv").config();
const GetKuda = require("./services/kuda.js");
const Gettime = require("./services/time.js");
const apiKey = process.env.VT_LIVE_API;
const secretKey = process.env.VT_LIVE_SECRET;
const publicKey = process.env.VT_LIVE_PUBLIC;
async function Make() {
    try {
        // const accesstoken = await GetKuda(); // Returns my accesstoken for each requests
        // if (!accesstoken) {
        //     return
        // };
        // const payload = {
        //     serviceType: "VERIFY_BILL_CUSTOMER",
        //     requestRef: Gettime(),
        //     data: {
        //         "KudaBillItemIdentifier": "KUD-BET-1XBT-001",
        //         "CustomerIdentification": "46432634278"
        //     },
        // };

        const response = await axios.get(
            "https://vtpass.com/api/service-variations?serviceID=mtn-data",
            {
                headers: {
                    "api-key": apiKey,
                    "public-key": publicKey,
                  },
            }
        );
        const mydata = response.data.content;
        console.log(mydata);
        // This is the part where i receive the error response, Indicates that the response is directly from Kuda
    } catch (error) {
        // Unnecessary Part, it never gets here
        console.log(error);
        console.error("Error:", error.response);
    }
};

Make();
