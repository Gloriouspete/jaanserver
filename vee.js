require("dotenv").config();
const axios = require("axios");
const apiKey = process.env.VT_SAND_API;
const secretKey = process.env.VT_SAND_SECRET;
const datasecret = process.env.DATA_SECRET;
const Gettime = require("./services/time.js");
const card = 233444
let cablename = "GOTV"
// async function Getelectric(req, res) {
//   const load = {
//     "cablename": Gettime(),
//     "cableplan": "waec-registration",
//     "smart_card_number": "1212121212",
//   };
//   const url = 'https://datastation.com.ng/api/cablesub/'
//   try {
//     const response = await axios.post(url, load, {
//       headers: {
//         "Authorization": `Token ${datasecret}`,
//         "Content-Type": "application/json"
//       }
//     })


//     const mydata = response.data;
//     console.log("check me", mydata);
//   } catch (error) {
//     console.error(error);
//   }
// }

async function Getelectric(req, res) {
  const load = {
    "cablename": Gettime(),
    "cableplan": "waec-registration",
    "smart_card_number": "1212121212",
  };
  const url = `https://datastation.com.ng/api/cablesub/id`
  try {
    const response = await axios.get(url, {
      headers: {
        "Authorization": `Token ${datasecret}`,
        "Content-Type": "application/json"
      }
    })


    const mydata = response.data;
    console.log("check me", mydata);
  } catch (error) {
    console.error(error);
  }
}
Getelectric();
