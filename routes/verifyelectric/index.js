require("dotenv").config();
const axios = require("axios");
const apiKey = process.env.VT_LIVE_API;
const secretKey = process.env.VT_LIVE_SECRET;
async function Verifyelectric(req, res) {
  const { plans, numbers,type } = req.body;
  const load = {
    serviceID: plans,
    billersCode: numbers,
    type
  };
  try {
    if (!plans || !numbers) {
      return res.status(400).json({
        success: false,
        message: "Unable to verify",
        data: null,
      });
    }
    const response = await axios.post(
      `https://api-service.vtpass.com/api/merchant-verify`,load,
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
          "secret-key": secretKey,
        },
      }
    );
    const responseData = response.data;
    if (responseData.code === "000") {
      return res.status(200).json({
        success: true,
        message: "Cable Plans verified",
        data: responseData.content,
      });
    } else {
      return res.status(400).json({
        success: true,
        message: "Unable to verify Number",
        data: null,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Unable to verify",
      data: null,
    });
  }
}

module.exports = Verifyelectric;
