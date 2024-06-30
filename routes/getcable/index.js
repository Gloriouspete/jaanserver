require('dotenv').config()
const axios = require('axios')
const datasecret = process.env.DATA_SECRET;

async function Getcable(req, res) {
  const userid = req.user.userid;
  const authToken = datasecret;
  const { plans } = req.body;
  console.log("Received phonenumber:", userid);
  try {
    const response = await axios.get(
      `https://api.connectvaluedataservice.com/api/v1/transactions/cable/plans/${plans}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    const filteredData = [];
    console.log("check me", response.data.data);
    response.data.data.varations.forEach((item) => {
      const amount = parseFloat(item.variation_amount);
      if (!isNaN(amount)) {
        filteredData.push({
          ...item,
          variation_amount: amount + 50,
        });
      }
    });
    return res.status(200).json({
      success: true,
      message: "Cable Plans retrieved successfully",
      data: filteredData,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "User details retrieved successfully",
      data: null,
    });
  }
}

module.exports = Getcable;