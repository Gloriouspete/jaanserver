const executor = require("../../config/db.js");
require("dotenv").config();
const mydate = new Date()
const datasecret = process.env.DATA_SECRET;
const axios = require("axios");
async function Buyelectric(req, res) {
  // console.log("git here");
  const { userid } = req.user;
  const { billersCode, serviceID, variation_code, phone, amount } = req.body;
  const intamount = parseInt(amount, 10);

  try {
    const [userData] = await executor(
      "SELECT phonenumber, accountbalance FROM appusers WHERE userid = ?",
      [userid]
    );
    if (!userData) {
      return res
        .status(404)
        .json({
          message: "User Details not found, contact support!",
          success: false,
        });
    }
    const { phonenumber, accountbalance } = userData;
    const balance = parseInt(accountbalance, 10);
    if (balance < intamount) {
      // console.log("no money");
      return res.status(402).json({
        message: "You have Insufficient balance to purchase this service",
        success: false,
      });
    } else if (balance >= intamount) {
      let data = JSON.stringify({
        billersCode: billersCode,
        serviceID: serviceID,
        variation_code: variation_code,
        phone: phone,
        amount: amount,
      });

      const response = await axios.post(
        `https://api.connectvaluedataservice.com/api/v1/transactions/electricity/purchase`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${datasecret}`,
          },
        }
      );
      const responseData = response.data;
      console.log(response);
      console.log(responseData);

      if (responseData.success) {
        const {
          meter_no: recipient,
          token: plan,
          created_at,
          biller,
        } = responseData.data.service;

        const imade = {
          userid,
          phonenumber,
          recipient,
          Status: "success",
          network: biller,
          plan,
          amount,
          created_at,
        };

        await setCable(imade);
        await executor(
          "UPDATE appusers SET accountbalance = accountbalance - ? WHERE userid = ?",
          [intamount, userid]
        );
        return res.status(200).json({
          message: `Your Electric Purchase Transaction was Successful and the token is ${plan}`,
          success: true,
        });
      } else {
        return res.status(500).json({
          message: "Electricity Purchase Failed, Kindly Try Again later ",
          success: false,
        });
      }
    }
  } catch (error) {
    const responsed = {
      message:"We apologize, but were currently unable to process your electricity plan purchase. Please try again later.",
      success: false,
      data: error,
    };
    console.log(error);
    res.status(500).json(responsed);
  }
}

const setCable = async (data) => {
  const {
    userid,
    phonenumber,
    recipient,
    Status,
    network,
    plan,
    amount,
    created_at,
  } = data;

  const parsedDate = new Date(created_at);
  const formattedDate = `${parsedDate.getFullYear()}-${(
    parsedDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${parsedDate.getDate().toString().padStart(2, "0")} 
        ${parsedDate.getHours().toString().padStart(2, "0")}:${parsedDate
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${parsedDate.getSeconds().toString().padStart(2, "0")}`;

  try {
    const query = `INSERT INTO transactions (userid,phonenumber, buynumber, status, price, date, network, size,service) VALUES (?,?,?,?,?,?,?,?,?)`;
    executor(query, [
      userid,
      phonenumber,
      recipient,
      Status,
      amount,
      formattedDate,
      network,
      plan,
      "electric",
    ])
      .then((results) => {
         console.log("successful!", results);
      })
      .catch((error) => {
         console.log("error setting transaction",mydate);
      });
  } catch (error) {
    // console.log(error);
    mydate
  }
};

module.exports = Buyelectric;

/*
{
  message: 'TRANSACTION SUCCESSFUL',
  data: {
    id: 2985,
    reference: 'TXN897322339',
    amount: 490,
    type: 'debit',
    sub_type: 'electricity',
    service: {
      id: 4,
      user_id: '3',
      reference: '202405291933',
      requestId: '202405291933',
      token: 'Token : 69488685079193451699',
      biller: 'Abuja Electricity Distribution Company- AEDC',
      units: '0',
      customer: '[empty]',
      address: 'connectvaluedataservice@gmail.com',
      phone: '09039968560',
      meter_no: '45051022163',
      type: 'prepaid',
      created_at: '2024-05-29T18:33:47.000000Z',
      updated_at: '2024-05-29T18:33:47.000000Z'
    },
    status: 'success',
    created_at: '2024-05-29T18:33:47.000000Z'
  },
  success: true
}
  */
