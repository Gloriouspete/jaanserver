require("dotenv").config();
const axios = require("axios");
const apiKey = process.env.VT_SAND_API;
const secretKey = process.env.VT_SAND_SECRET;
const Gettime = require("./services/time.js")
async function Getelectric(req, res) {
  const requesttime = Gettime();
  const load = {
    "request_id":requesttime,
    serviceID: "etisalat-sme-data",
    billersCode: "08011111111",
    variation_code: "eti-sme-100",
    amount: 100,
    phone: "08011111111",
  };
  try {
    const response = await axios.post(
      "https://sandbox.vtpass.com/api/pay",
      load,
      {
        headers: {
          "api-key": apiKey,
          "secret-key": secretKey,
        },
      }
    );
    const mydata = response.data;
    console.log(mydata.content.transactions.product_name)
    console.log(mydata.requestId );
  } catch (error) {
    console.error(error);
  }
}
async function Getdata(req, res) {
  const requesttime = Gettime();
  const load = {
    "request_id":requesttime,
    serviceID: "g",
   // billersCode: "1111111111111",
   // variation_code: "prepaid",
    amount: 500,
    phone: "08011111111",
  };
  try {
    const response = await axios.get(
      "https://sandbox.vtpass.com/api/service-variations?serviceID=waec-registration ",
      {
        headers: {
          "api-key": apiKey,
          "secret-key": secretKey,
        },
      }
    );
    const mydata = response.data;

    console.log(mydata.content.varations );
  } catch (error) {
    console.error(error);
  }
}

//Getelectric();
Getdata()
