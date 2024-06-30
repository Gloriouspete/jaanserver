const axios = require("axios");
require('dotenv').config()
const datasecret = process.env.DATA_SECRET;
const Getbalance = async (req, res) => {
  const userid = req.user.userid;
  console.log("Received phonenumber:", userid);

  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://api.connectvaluedataservice.com/api/v1/user/account",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${datasecret}`,
      },
      data: null,
    };
    const response = await axios(config);
    const result = response.data;
    console.log(result);
    const balance = result.user.balance;
    return res.status(200).json({
      success: true,
      message: "Successfully Returned",
      data: balance,
    });
  } catch (error) {
    console.error("Error finding user credentials:", error);
    return res.status(500).json({
      success: false,
      message: "Thi not found",
      data: null,
    });
  }
};

module.exports = Getbalance;
