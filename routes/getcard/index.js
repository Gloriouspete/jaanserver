require("dotenv").config();
const axios = require("axios");
const GetKuda = require("../../services/kuda");
const Gettime = require("../../services/time.js");
async function Getcard(req, res) {
  try {
    const accesstoken = await GetKuda();
    if (!accesstoken) {
      res.status(400).json({
        success: false,
        message: "Something went wrong, Contact support!",
        data: null,
      });
    }
    const payload = {
      serviceType: "GET_GIFT_CARD",
      requestRef: Gettime(),
      data: {},
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
    const responseData = response.data;
    //console.log(responseData);
    if (responseData.status) {
      const giftCard = responseData.data.giftCardData;
      return res.status(200).json({
        success: true,
        message: "Cable Plans retrieved successfully",
        data: giftCard,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Unable to retrieve giftcard plans",
        data: null,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "Unable to retrieve plans",
      data: null,
    });
  }
}

module.exports = Getcard;
