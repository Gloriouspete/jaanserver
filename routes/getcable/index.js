require("dotenv").config();
const axios = require("axios");
const Gettime = require("../../services/time.js");
const accesstoken = process.env.DATA_SECRET;
async function Getcable(req, res) {
  try {

    if (!accesstoken) {
      res.status(400).json({
        success: false,
        message: "Something went wrong, Contact support!",
        data: null,
      });
    }
    const payload = {
      serviceType: "GET_BILLERS_BY_TYPE",
      requestRef: Gettime(),
      data: {
        "BillTypeName": "cabletv",
      },
    };
    const response = await axios.get(
      "https://datastation.com.ng/api/cable/",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${accesstoken}`,
        },
      }
    );
    const responseData = response.data;
    console.log(responseData)
    if (response.status === 200) {
      return res.status(200).json({
        success: true,
        message: "Cable Plans retrieved successfully",
        data: responseData ,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Unable to retrieve Cable plans",
        data: null,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve Cable plans",
      data: null,
    });
  }
}

module.exports = Getcable;


// require("dotenv").config();
// const axios = require("axios");
// const Gettime = require("../../services/time.js");
// const GetKuda = require("../../services/kuda");
// async function Getcable(req, res) {
//   try {
//     const accesstoken = await GetKuda();
//     if (!accesstoken) {
//       res.status(400).json({
//         success: false,
//         message: "Something went wrong, Contact support!",
//         data: null,
//       });
//     }
//     const payload = {
//       serviceType: "GET_BILLERS_BY_TYPE",
//       requestRef: Gettime(),
//       data: {
//         "BillTypeName": "cabletv",
//       },
//     };
//     const response = await axios.post(
//       "https://kuda-openapi-uat.kudabank.com/v2.1",
//       payload,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accesstoken}`,
//         },
//       }
//     );
//     const responseData = response.data;
//     console.log(responseData)
//     if (responseData.status) {
//       const bettingResponse = responseData.data.billers;
//       return res.status(200).json({
//         success: true,
//         message: "Cable Plans retrieved successfully",
//         data: bettingResponse,
//       });
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: "Unable to retrieve Cable plans",
//         data: null,
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Unable to retrieve Cable plans",
//       data: null,
//     });
//   }
// }

// module.exports = Getcable;
