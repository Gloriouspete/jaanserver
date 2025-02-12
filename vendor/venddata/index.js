const executor = require("../../config/db.js");
require("dotenv").config();
const datasecret = process.env.DATA_SECRET;
const axios = require("axios");
const NodeCache = require("node-cache");
const Points = require("../../services/points/points.js");
const Vemail = require("../../services/emailverify.js");
const { check, validationResult } = require("express-validator");
const Verifydata = require("../../services/verifydata/index.js");
const networkMap = {
    mtn: '1',
    airtel: '4',
    glo: '2',
    '9mobile': '3',
};
const myCache = new NodeCache();
async function Venddata(req, res) {
    let deductedAmount = 0
    const userid = req.user;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error(errors.array())
        return res.status(400).json({ success: false, message: "Input Sanitization Failed, Invalid parameters", error: errors.array() });
    }
    try {
        const { network, number, dataid } = req.body;
        if (!network || typeof network !== 'string') {
            return res.status(400).json({
                success: false,
                message: "Bad request: 'netcode' parameter is missing or invalid.",
                data: null,
            });
        }
        const normalizedNetcode = network.toLowerCase();
        const netcode = networkMap[normalizedNetcode];
        if (!netcode) {
            return res.status(400).json({
                success: false,
                message: `Bad request: '${network}' is not a valid network code.`,
                data: null,
            });
        }
        const [userData] = await executor(
            "SELECT * FROM users WHERE userid = ?",
            [userid]
        );
        if (!userData) {
            console.error("Account not found");
            return res.status(404).json({
                success: false,
                message: "Account not found in our system, Kindly contact support",
                data: null
            })
        };
        const { phone, credit, email, verified, ban } = userData;
        const balance = parseInt(credit, 10);
        const intamount = await Verifydata(netcode, dataid)
        if (!intamount || intamount === undefined) {
            return res.status(500).json({
                success: false,
                message: "Internal server error, contact support",
                data: null
            })
        }
        if (ban === "yes") {
            console.error("This user has been banned");
            return res
                .status(401)
                .json({
                    success: false,
                    message:
                        "You have been banned from using Jaan services.",
                });
        }
        const newbalance = balance - intamount;
        if (newbalance < 0 || newbalance === undefined) {
            console.log("Insufficient funds");
            return res.status(403).json({
                success: false,
                message: "Insufficient Funds,This transaction could not be completed",
                data: null,
            });
        }
        await executor("UPDATE users SET credit = credit - ? WHERE userid = ?", [
            intamount,
            userid,
        ]);
        deductedAmount = intamount
        const authToken = datasecret;
        const data = {
            network: netcode,
            mobile_number: number,
            plan: dataid,
            Ported_number: true,
        };
        const config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "https://datastation.com.ng/api/data/",
            headers: {
                Authorization: `Token ${authToken}`,
                "Content-Type": "application/json",
            },
            data: data,
        };
        const response = await axios(config);
        const responseData = response.data;
        const { mobile_number, Status, plan_network, plan_name } =
            responseData;
        const newdate = new Date();
        const create_date = newdate.toISOString();
        const imade = {
            userid,
            recipient: mobile_number,
            Status,
            network: plan_network,
            plan: plan_name,
            amount: intamount,
            create_date,
        };
        await setData(imade);
        if (responseData.Status === "successful") {
            return res.status(200).json({
                success: true,
                message: "Data Purchase Transaction is Successful ",
                data: {
                    amount: intamount,
                    status: Status,
                    plan: plan_name,
                    network: plan_network,
                    recipient: mobile_number,
                    date: create_date,
                    channel: "api",
                },
            });
        } else {
            await executor("UPDATE users SET credit = credit + ? WHERE userid = ?", [
                deductedAmount,
                userid,
            ]);
            return res.status(500).json({
                success: false,
                message: "Data Purchase" + " " + responseData.Status,
                data: {
                    status: Status,
                    plan: plan_name || null,
                    recipient: mobile_number || number
                },
            });
        }
    } catch (error) {
        await executor("UPDATE users SET credit = credit + ? WHERE userid = ?", [
            deductedAmount,
            userid,
        ]);
        console.error(error.response?.data);
        res
            .status(500)
            .json({
                message: "Currently Unable to purchase data, kindly try agin later",
                success: false,
            });
    } finally {
        // Release transaction lock
        myCache.del(`datatransactionLocks:${userid}`);
    }
}

const setData = async (data) => {
    const { userid, recipient, Status, network, plan, amount, create_date } =
        data;

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

module.exports = Venddata;
