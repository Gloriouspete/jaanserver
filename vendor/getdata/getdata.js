const executor = require("../../config/db.js");
const axios = require("axios");
require('dotenv').config()
const datasecret = process.env.DATA_SECRET;
async function GetVenddata(req, res) {
    const { network, type } = req.body;
    if (typeof network !== "string" || network.length < 1 || network.length > 10) {
        return res.status(400).json({
            success: false,
            message: "Network must be a string and must be in between 1 to 10 digits character"
        })
    }
    if (typeof type !== "string" || type.length < 1 || type.length > 20) {
        return res.status(400).json({
            success: false,
            message: "Network must be a string and must be in between 1 to 10 digits character"
        })
    }
    const url = 'https://datastation.com.ng/api/network/';
    const authToken = datasecret;
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Token ${authToken}`,
                'Accept': 'application/json',
            }
        });
        let transformedData = [];
        switch (network) {
            case 'mtn':
                transformedData = transformData(response.data.MTN_PLAN, type);
                break;
            case 'glo':
                transformedData = transformData(response.data.GLO_PLAN, type);
                break;
            case '9mobile':
                transformedData = transformData(response.data['9MOBILE_PLAN'], type);
                break;
            case 'airtel':
                transformedData = transformData(response.data.AIRTEL_PLAN, type);
                break;
            default:
                transformedData = response.data;
                break;
        }
        console.log(transformedData, type)
        res.status(200).json({
            success: true,
            message: "Data Plans retrieved successfully",
            data: transformedData
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Data Plans failed to retrieve, Contact support",
            data: null
        })
    }
}
module.exports = GetVenddata;
function transformData(data, type) {
    return data
        .filter(product => product.plan_type !== 'DATA COUPONS' && product.plan_type === type.toUpperCase())
        .map(product => {
            const { plan_amount, plan_network, id, plan, month_validate, plan_type } = product;
            const multipliedAmount = parseFloat(plan_amount) * 1.03;
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

