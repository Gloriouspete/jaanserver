require("dotenv").config();
const axios = require("axios");
const datasecret = process.env.SECRET;

async function Verifycable(req, res) {
  const userid = req.user.userid;
  const { plans, numbers } = req.body;
  const load = JSON.stringify({
    serviceID: plans,
    billersCode: numbers,
  });
  try {
    const response = await axios.post(
      "https://api-service.vtpass.com/api/merchant-verify",
      load,
      {
        headers: {
          username: "jaanservicesmail@gmail.com",
          password: datasecret,
        },
      }
    );
    const responseData = response.data;
    return res.status(200).json({
      success: true,
      message: "Cable Plans retrieved successfully",
      data: null,
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

module.exports = Verifycable;
