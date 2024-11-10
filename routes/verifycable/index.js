require("dotenv").config();
const axios = require("axios");
const secretKey = process.env.DATA_SECRET;
async function Verifycable(req, res) {
  const { plans, numbers } = req.body;
  const load = {
    serviceID: plans,
    billersCode: numbers,
  };
  try {
    if (!plans || !numbers) {
      return res.status(400).json({
        success: false,
        message: "Unable to verify",
        data: null,
      });
    }
    const cablename = getCableName(plans);
    if (!cablename || cablename === null) {
      return res.status(400).json({
        success: false,
        message: "We encountered a problem validating your request, Please try again later",
        data: null,
      });
    }
    const response = await axios.get(
      `https://datastation.com.ng/ajax/validate_iuc?smart_card_number=${numbers}&cablename=${cablename}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${secretKey}`
        }
      }
    );
    const responseData = response.data;
    console.log(responseData)
    if (response.status === 200) {
      return res.status(200).json({
        success: true,
        message: "Cable Plans verified",
        data: responseData,
      });
    } else {
      return res.status(400).json({
        success: true,
        message: "Unable to verify Number,Please Check Number",
        data: null,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "We encountered a problem with your request!",
      data: null,
    });
  }
}

module.exports = Verifycable;
const getCableName = (id) => {
  let name;
  switch (id) {
    case "1":
      name = "GOTV"
      break;
    case "2":
      name = "DSTV"
      break;
    case "3":
      name = "STARTIME"
      break;

  }
  return name || null
}