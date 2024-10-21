require("dotenv").config();
const axios = require("axios");
const GetKuda = require("../../services/kuda");
const Gettime = require("../../services/time.js");
async function Getelectric(req, res) {
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
        "BillTypeName": "electricity",
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
    const responseData = response.data;
    //console.log(responseData)
    if (responseData.status) {
      const Response = responseData.data.billers;
      console.log(Response)
      return res.status(200).json({
        success: true,
        message: "Electricity Plans retrieved successfully",
        data: Response,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Unable to retrieve Electricity plans",
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
