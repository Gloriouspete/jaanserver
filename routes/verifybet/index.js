require("dotenv").config();
const axios = require("axios");
const GetKuda = require("../../services/kuda.js");
const Gettime = require("../../services/time.js");
async function Verifybet(req, res) {
  const { number, type } = req.body;
  console.log(req.body)
  try {
    const accesstoken = await GetKuda();
    if (!type || !number) {
      return res.status(400).json({
        success: false,
        message: "Input validation failed",
        data: null,
      });
    }
    if (!accesstoken) {
      return res.status(400).json({
        success: false,
        message: "Unable to verify, Contact Support",
        data: null,
      });
    }
    const payload = {
      serviceType: "VERIFY_BILL_CUSTOMER",
      requestRef: Gettime(),
      data: {
        "KudaBillItemIdentifier": type,
        "CustomerIdentification": number
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
    console.log(responseData)
    if (responseData.status) {
      return res.status(200).json({
        success: true,
        message: "Betting verified",
        data: responseData.data,
      });
    } else {
      return res.status(400).json({
        success: true,
        message: responseData?.message || "Unable to verify Betting ID",
        data: null,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Unable to verify, Internal server error",
      data: null,
    });
  }
}

module.exports = Verifybet;
