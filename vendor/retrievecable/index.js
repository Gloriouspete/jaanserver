require('dotenv').config()
const axios = require('axios')
const apiKey = process.env.VT_LIVE_API;
const publicKey = process.env.VT_LIVE_PUBLIC;

async function Retrievecable(req, res) {
    const { plans } = req.body;
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
        variations.forEach(product => {
            const text = product.name;
            function addNumberToText(text) {
                return text.replace(/(\d{1,3}(,\d{3})*)/, (match) => {
                    const numericValue = parseInt(match.replace(/,/g, ''));
                    return (numericValue + numericValue <= 5000 ? 30 : 60).toLocaleString();
                });
            }
            const updatedName = addNumberToText(text);
            product.name = updatedName;
        });
        return res.status(200).json({
            success: true,
            message: "Cable Plans retrieved successfully",
            data: variations,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Unable to retrieve plans",
            data: null,
        });
    }
}

module.exports = Retrievecable;