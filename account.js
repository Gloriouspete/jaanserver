require("dotenv").config();
const API_KEY = process.env.MONNIFY_CLIENT;
const SECRET_KEY = process.env.MONNIFY_SECRET;
const axios = require("axios");
const getAccount = async (userid, email, username,type,number) => {
  const credentials = `${API_KEY}:${SECRET_KEY}`;
  const encodedCredentials = Buffer.from(credentials).toString("base64");
  const authHeader = `Basic ${encodedCredentials}`;

  const loginEndpoint = "https://api.monnify.com/api/v1/auth/login";

  try {
    const loginResponse = await axios.post(
      loginEndpoint,
      {},
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );

    const accessToken = loginResponse.data.responseBody.accessToken;

    const url =
      "https://api.monnify.com/api/v2/bank-transfer/reserved-accounts";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    
     let requestBody;

     requestBody = {
      accountReference: userid,
      accountName: username,
      currencyCode: "NGN",
      contractCode: "832728158702",
      customerEmail: email,
      customerName: email,
      type:number ,
      getAllAvailableBanks: false,
      preferredBanks: ["035"],
    };
      
    if(type === "bvn"){
      requestBody.bvn = number
    }else{
      requestBody.nin = number
    }

    const response = await axios.post(url, requestBody, { headers });
    const responseData = response.data;
    console.log(responseData);

    if (responseData.requestSuccessful) {
      const accounts = responseData.responseBody.accounts;
      console.log(accounts);
      const result = {
        success: true,
        data: accounts[0],
      };
      return result;
    } else {
      throw new Error("Error creating account");
    }
  } catch (error) {
    console.error(error.response ? error.response.data.responseMessage : error.message);
    const newmessage = error.response ? error.response.data.responseMessage : error.message;
    throw newmessage;;
  }
};


module.exports = getAccount
