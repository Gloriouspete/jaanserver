const executor = require("../../config/db.js");
const axios = require("axios");
require('dotenv').config()
const datasecret = process.env.DATA_SECRET;
async function Verifydata(network, id) {
    const url = 'https://datastation.com.ng/api/network/';
    const authToken = datasecret;
    try {
        if (!network || typeof (network) !== "string") {
            throw "Network does not exist or is not a string symbol"
        }
        if (!id) {
            throw "Id does not exist"
        }
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Token ${authToken}`,
                'Accept': 'application/json',
            }
        });
        let transformedData = [];
        switch (network) {
            case 'mtn':
                transformedData = transformData(response.data.MTN_PLAN, id);
                break;
            case 'glo':
                transformedData = transformData(response.data.GLO_PLAN, id);
                break;
            case '9mobile':
                transformedData = transformData(response.data['9MOBILE_PLAN'], id);
                break;
            case 'airtel':
                transformedData = transformData(response.data.AIRTEL_PLAN, id);
                break;
            default:
                transformedData = [];
                break;
        }
        return transformData
    } catch (error) {
        console.error(error);
        throw new Error(error)
    }
}

function transformData(data, id) {
    const result = data.filter(product => product.dataplan_id === id.toString())
    if (!result || result.length === 0) {
        throw new Error("Error filtering data, id might be incorrect")
    }
    const amount = result[0].plan_amount;
    const multipliedAmount = parseFloat(amount) * 1.03;
    const floatedAmount = Math.floor(multipliedAmount)
    return floatedAmount
}

module.exports = Verifydata;