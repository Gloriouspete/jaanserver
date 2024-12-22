const axios = require("axios");
require('dotenv').config()
const apiKey = process.env.VT_LIVE_API;
const publicKey = process.env.VT_LIVE_PUBLIC;
async function Getalldata(req, res) {
    const { network, type } = req.body;
    const url = `https://vtpass.com/api/service-variations?serviceID=${network}`;
    try {

        const response = await axios.get(url, {
            headers: {
                "api-key": apiKey,
                "public-key": publicKey,
            },
        });
        console.log(response.data)
        const mydata = response.data.content?.variations;
        res.status(200).json({
            success: true,
            message: "Successfully retrieved",
            data: mydata
        })

    } catch (error) {
        console.error(error.response?.data);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            data: mydata
        })

    }
}
module.exports = Getalldata;

