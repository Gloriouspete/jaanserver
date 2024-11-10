require("dotenv").config();
const axios = require("axios");
const GetKuda = require("../../services/kuda.js");
const Gettime = require("../../services/time.js");
async function Verifyelectric(req, res) {
  const { number, type } = req.body;
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
        "KudaBillItemIdentifier": "KUD-ELE-AEDC-001",
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
    const responseData = response.data;
    if (responseData.status) {
      return res.status(200).json({
        success: true,
        message: "Cable Plans verified",
        data: responseData.data,
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
      message: "Unable to verify, Internal server error",
      data: null,
    });
  }
}

module.exports = Verifyelectric;
