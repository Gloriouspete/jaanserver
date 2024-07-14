require('dotenv').config()
const axios = require('axios')
const datasecret = process.env.DATA_SECRET;

async function Getelectric(req, res) {
  const userid = req.user.userid;
  const authToken = datasecret;
  console.log("Received phonenumber:", userid);
  try {
    const response = await axios.get(
      `https://api.con`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    const filteredData = response.data.data;
    console.log("check me", response.data.data);
    
    return res.status(200).json({
      success: true,
      message: "Cable Plans retrieved successfully",
      data: filteredData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Unable to get electricity, try again later",
      data: null,
    });
  }
}

module.exports = Getelectric;