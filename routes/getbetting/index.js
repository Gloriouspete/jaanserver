require("dotenv").config();
const axios = require("axios");
const GetKuda = require("../../services/kuda");
const Gettime = require("../../services/time.js");
async function Getbetting(req, res) {
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
      serviceType: "GET_BILLERS_BY_TYPE",
      requestRef: Gettime(),
      data: {
        "BillTypeName": "betting",
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
    const responseData = response.data;
    if (responseData.status) {
      const bettingResponse = responseData.data.billers;
      return res.status(200).json({
        success: true,
        message: "Betting Plans retrieved successfully",
        data: bettingResponse,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Unable to retrieve Betting plans",
        data: null,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve plans",
      data: null,
    });
  }
}

module.exports = Getbetting;
