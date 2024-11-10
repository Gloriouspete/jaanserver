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
            serviceType: "VERIFY_BILL_CUSTOMER",
            requestRef: Gettime(),
            data: {
                "KudaBillItemIdentifier": "KUD-BET-1XBT-001",
                "CustomerIdentification": "46432634278"
            },
        };

        const response = await axios.post(
            "https://kuda-openapi.kuda.com/v2.1",
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accesstoken}`,
                },
            }
        );

        //console.log("see response:", response.data);
        const mydata = response.data;
        //const gift = mydata.data.billersn;
        console.log(mydata);
        // This is the part where i receive the error response, Indicates that the response is directly from Kuda
    } catch (error) {
        // Unnecessary Part, it never gets here
        console.log(error);
        console.error("Error:", error.response);
    }
}

Make();
