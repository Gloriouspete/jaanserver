require('dotenv').config()
const axios = require('axios')
const datasecret = process.env.DATA_SECRET;

async function Getelectric(req, res) {
  const authToken = datasecret;
  console.log("Received phonenumber:")
  try {
    const response = await axios.get(
      'https://datastation.com.ng/api/data/58',
      {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      }
    );
    //const filteredData = response.data.data;
    console.log("check me", response.data);
   
  } catch (error) {
    console.error(error);
   
  }
}

Getelectric();