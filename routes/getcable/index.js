require('dotenv').config()
const axios = require('axios')
const datasecret = process.env.SECRET;

async function Getcable(req, res) {
  const userid = req.user.userid;
  const authToken = datasecret;
  const { plans } = req.body;
  console.log("Received phonenumber:", userid);
  try {
    const response = await axios.get(
      `https://sandbox.vtpass.com/api/service-variations?serviceID=${plans}`,
      {
        headers: {
          "username": "jaanservicesmail@gmail.com",
          "password": datasecret,
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