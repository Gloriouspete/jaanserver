const executor = require("../../config/db.js");
require("dotenv").config();
const datasecret = process.env.DATA_SECRET;
const axios = require("axios");
const NodeCache = require('node-cache');
const Points = require("../../services/points/points.js");
const Vemail = require("../../services/emailverify.js");
const myCache = new NodeCache();
async function Buydata(req, res) {
  const userid = req.user.userid;
  try {
      const { netcode, dataplan, number, dataamount, pincode } = req.body;

      const lockExists = myCache.get(`datatransactionLocks:${userid}`);
      if (lockExists) {
          console.log('Transaction in progress');
          return res.status(200).json({
              "success": false,
              "message": 'Too Many Requests',
              "data": null
          });
      }

      myCache.set(`datatransactionLocks:${userid}`, 'locked', 10);

      const [userData] = await executor('SELECT pin, phone, credit FROM users WHERE userid = ?', [userid]);

      if (!userData) {
          console.error('Account not found');
          return res.send('Account not found');
      }
      const emailverified = await Vemail(userid);


      if (emailverified === "no") {
        console.error("Account not verified");
        return res.json({ success: false, message: "Your email address has not been verified. Please verify your email address before proceeding with this transaction." });
      }
      const { pin, phone, credit,email } = userData;
      const mypin = parseInt(pin, 10)
      const balance = parseInt(credit, 10)


      if (mypin.toString().trim() !== pincode.toString().trim()) {
          console.log('incorect pin')
          return res.status(200).json({
              "success": false,
              "message": 'Incorrect Pin',
              "data": null
          });
      }
      const newbalance = balance - dataamount;

      if (newbalance < 0 || newbalance === undefined) {
          console.log('Insufficient funds');

          return res.status(200).json({
              "success": false,
              "message": 'Insufficient Funds',
              "data": null
          });
      } else if (balance < dataamount) {
          console.log('no money')
          return res.status(200).json({
              "success": false,
              "message": 'Insufficient Funds',
              "data": null
          });
      }
      else if (balance >= dataamount) {
          const authToken = datasecret;
          const data = {
              "network": netcode,
              "mobile_number": number,
              "plan": dataplan,
              "Ported_number": true
          };
          const config = {
              method: 'post',
              maxBodyLength: Infinity,
              url: 'https://datastation.com.ng/api/data/',
              headers: {
                  'Authorization': `Token ${authToken}`,
                  'Content-Type': 'application/json',
              },
              data: data,
          };

          const response = await axios(config);
          const responseData = response.data;
          const { mobile_number, Status, plan_network, plan_name, plan_amount } = responseData;
          const newdate = new Date()
          const create_date  = newdate.toISOString()
          const imade = {userid, recipient:mobile_number, Status, network:plan_network, plan:plan_name, amount:dataamount, create_date };
          await setData(imade);

          if (responseData.Status === 'successful') {
              const newbalancee = balance - dataamount;
              await executor('UPDATE users SET credit = ? WHERE userid = ?', [newbalancee, userid]);
              Points(userid,dataamount,email)
              return res.status(200).json({
                  "success": true,
                  "message": 'Data Purchase Successful ',
                  "data": null
              });
          } else {
              return res.status(200).json({
                  "success": false,
                  "message": 'Data Purchase' + ' ' + responseData.Status,
                  "data": null
              });
          }
      }

  } catch (error) {
      console.error(error.response?.data);
      res.status(500).json({message:'Currently Unable to purchase data, kindly try agin later',success:false});
  }
  finally {
      // Release transaction lock
      myCache.del(`datatransactionLocks:${userid}`);
  }
};


const setData = async (data) => {
  const {
    userid,
    recipient,
    Status,
    network,
    plan,
    amount,
    create_date,
  } = data;

   
  try {
    const query = `INSERT INTO transactions (userid, recipient, status, price, date, network, plan,service) VALUES (?,?,?,?,?,?,?,?)`;
    executor(query, [
      userid,
      recipient,
      Status,
      amount,
      create_date,
      network,
      plan,
      "data",
    ])
      .then((results) => {
        // console.log("successful!", results);
      })
      .catch((error) => {
        // console.log("error setting transaction");
      });
  } catch (error) {
    console.log(error);
  }
};

module.exports = Buydata;