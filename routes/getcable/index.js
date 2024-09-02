require('dotenv').config()
const axios = require('axios')
const datasecret = process.env.SECRET;
const apiKey = process.env.VT_LIVE_API;
const publicKey = process.env.VT_LIVE_PUBLIC;

async function Getcable(req, res) {
  const { plans } = req.body;
  try {
    const response = await axios.get(
      `https://api-service.vtpass.com/api/service-variations?serviceID=${plans}`,
      {
        headers: {
          "api-key": apiKey,
          "public-key": publicKey,
        },
      }
    );
    const responseData = response.data;
    const variations = responseData.content.varations;
    return res.status(200).json({
      success: true,
      message: "Cable Plans retrieved successfully",
      data: variations,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Unable to retrieve plans",
      data: null,
    });
  }
}

module.exports = Getcable;