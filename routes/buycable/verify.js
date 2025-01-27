require('dotenv').config()
const axios = require('axios')
const datasecret = process.env.SECRET;
const apiKey = process.env.VT_LIVE_API;
const publicKey = process.env.VT_LIVE_PUBLIC;

async function Comfirmcable (plans, code,amounts) {
    if (!plans || !code) {
        throw new Error("Unable to parse request, check plans")
    }
    try {
        const response = await axios.get(
            `https://vtpass.com/api/service-variations?serviceID=${plans}`,
            {
                headers: {
                    "api-key": apiKey,
                    "public-key": publicKey,
                },
            }
        );
        const responseData = response.data;
        const variations = responseData.content.varations;
        console.log(variations)
        const result = variations.filter(product => product.variation_code === code)
        if (!result || result.length === 0) {
            throw new Error("Error filtering data, Variation code might be incorrect")
        }
        const amount = result[0].variation_amount;
        const multipliedAmount = parseFloat(amount) + parseInt(amounts) || 50;
        const floatedAmount = Math.floor(multipliedAmount)
        return floatedAmount
    } catch (error) {
        console.error(error);
        throw new Error("too real")
    }
}

module.exports = Comfirmcable;