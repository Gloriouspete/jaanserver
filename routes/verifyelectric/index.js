require("dotenv").config();
const axios = require("axios");
const secretKey = process.env.RE_TEST_SECRET;
async function Verifyelectric(req, res) {
  const { number, type } = req.body;
  console.log(req.body)
  try {
    if (!type || !number) {
      return res.status(400).json({
        success: false,
        message: "Input validation failed",
        data: null,
      });
    }
    var data = {
      "billPaymentProductId": type,
      "customerId": number
    };

    const response = await axios.post(
      "https://api-demo.systemspecsng.com/services/connect-gateway/api/v1/biller/validate-customer",
      data,
      {
        headers: {
          "secretKey":secretKey,
        },
      }
    );
    const responseData = response.data;
    console.log(responseData)
    if (responseData.status === "00") {
      return res.status(200).json({
        success: true,
        message: "Cable Plans verified",
        data: responseData.data,
      });
    } else {
      return res.status(400).json({
        success: true,
        message: responseData?.message || "Unable to verify Number",
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
};

module.exports = Verifyelectric;
