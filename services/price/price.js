const executor = require("../../config/db.js");
require("dotenv").config();
const datasecret = process.env.DATA_SECRET;
async function GetPricer() {
  try {
    const query = `SELECT cableprice,electricprice FROM admin where username = 'Jaan'`;
    const response = await executor(query, []);
    console.log(response);
    return response
  } catch (error) {
    console.log(error.response?.data);
    throw error
  }
}
module.exports = GetPricer;
