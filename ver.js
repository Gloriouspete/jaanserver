const executor = require("./config/db.js");
const axios = require("axios");
require('dotenv').config()
const datasecret = process.env.DATA_SECRET;
async function GetVenddata() {
  const network = 'mtn';
  const type = '28'
  const url = 'https://datastation.com.ng/api/network/';
  const authToken = datasecret;
  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Token ${authToken}`,
        'Accept': 'application/json',
      }
    });
    // console.log(response.data)
    let transformedData = [];
    switch (network) {
      case 'mtn':
        transformedData = transformData(response.data.MTN_PLAN, type);
        break;
      case 'glo':
        transformedData = transformData(response.data.GLO_PLAN, type);
        break;
      case '9mobile':
        transformedData = transformData(response.data['9MOBILE_PLAN'], type);
        break;
      case 'airtel':
        transformedData = transformData(response.data.AIRTEL_PLAN, type);
        break;
      default:
        transformedData = response.data;
        break;
    }
    console.log(transformedData)
    // res.status(200).json({
    //     success: true,
    //     message: "Data Plans retrieved successfully",
    //     data: transformedData
    // })

  } catch (error) {
    console.error(error);
    // res.status(500).json({
    //     success: false,
    //     message: "Data Plans failed to retrieve, Contact support",
    //     data: null
    // })
  }
}

function transformData(data, type) {
  const result = data.filter(product => product.dataplan_id === type)
  if (!result || result.length === 0) {
    throw new Error("Error filtering data, type might be incorrect")
  }
  const amount = result[0].plan_amount;
  const floatedAmount = Math.floor(amount)
  return floatedAmount
}

GetVenddata();