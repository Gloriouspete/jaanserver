require("dotenv").config();
const axios = require("axios");
const secretKey = process.env.RE_TEST_SECRET;
const Gettime = require("../../services/time.js");
async function Getelectric(req, res) {
    try {

        if (!secretKey) {
            res.status(400).json({
                success: false,
                message: "Something went wrong, Contact support!",
                data: null,
            });
        }
        const response = await axios.get(
            "https://api-demo.systemspecsng.com/services/connect-gateway/api/v1/biller/get-biller-by-category/3", {
            headers: {
                'secretKey': secretKey,
            },
        }
        );
        const responseData = response.data;
        //console.log(responseData)
        if (responseData.status === "00") {
            const Response = responseData.data;
            //console.log(Response)
            return res.status(200).json({
                success: true,
                message: "Electricity Plans retrieved successfully",
                data: Response,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Unable to retrieve Electricity plans, Please Try Again Later",
                data: null,
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to retrieve Electricity plans",
            data: null,
        });
    }
}

module.exports = Getelectric;
