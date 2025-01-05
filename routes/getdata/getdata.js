const executor = require("../../config/db.js");
const axios = require("axios");
require('dotenv').config()
const datasecret = process.env.DATA_SECRET;
async function Getdata(req, res) {
    const { network, type } = req.body;
    const url = 'https://datastation.com.ng/api/network/';
    const authToken = datasecret;
    console.log("whats api", authToken);
    try {

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Token ${authToken}`,
                'Accept': 'application/json',
            }
        });
        const dataprice = await GetDataAmount();
        if (!dataprice) {
            return res.status(500).json({
                success: false,
                message: "Can't find data price"
            })
        }
        let transformedData = [];
        switch (network) {
            case 'mtn':
                transformedData = transformData(response.data.MTN_PLAN, type,dataprice);
                break;
            case 'glo':
                transformedData = transformData(response.data.GLO_PLAN, type,dataprice);
                break;
            case '9mobile':
                transformedData = transformData(response.data['9MOBILE_PLAN'], type,dataprice);
                break;
            case 'airtel':
                transformedData = transformData(response.data.AIRTEL_PLAN, type,dataprice);
                break;
            default:
                transformedData = response.data;
                break;
        }
        console.log(transformedData, type)
        res.status(200).json({ success: true, message: "successfully retrieved", data: transformedData })

    } catch (error) {
        console.log(error.response?.data);
    }
}
module.exports = Getdata;


function transformData(data, type,dataprice) {
    return data
        .filter(product => product.plan_type !== 'DATA COUPONS' && product.plan_type === type)
        .map(product => {
            const { plan_amount, plan_network, id, plan, month_validate, plan_type } = product;
            const multipliedAmount = parseFloat(plan_amount) * (1 + (dataprice / 100));
            const rounded = Math.round(multipliedAmount);
            return {
                plan,
                month_validate,
                plan_type,
                network: plan_network,
                dataid: id,
                amount: rounded
            };
        });
}

async function GetDataAmount() {
    try {
        const query = `select * from admin where username = ?`
        const results = await executor(query, ["Jaan"])

        if (results.length === 0) {
            throw new Error('Dataprice not found for Jaanadmin');
        }
        const result = results[0].dataprice;
        const price = Number(result);
        console.log("See price:", price);
        return price;
    }
    catch (error) {
        console.error('Error finding user credentials:', error);
        throw error;
    }
}