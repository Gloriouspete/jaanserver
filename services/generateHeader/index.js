require("dotenv").config();
const axios = require("axios");
const apiKey = process.env.VEND_KEY;
const privateKey = process.env.PRIVATE_KEY;
const nonceSecret = process.env.NONCE;
const crypto = require("crypto");

async function GenerateHeader() {

    try {
        const nonce = generateNonce(nonceSecret);
        const dataToSign = apiKey + nonce;
        const sign = crypto.createSign('SHA256');
        sign.update(dataToSign);
        sign.end();
        const signature = sign.sign(privateKey, 'base64');
        return {
            'X-Api-Key': apiKey,
            'X-Nonce': nonce,
            'X-Signature': signature,
            'X-Currency-Code': "NGN",
            'X-Currency-Id': 160
        }
    } catch (error) {
        console.error(error);
        throw new Error("Error setting up authentication")
    }
}


function generateNonce(noncePrefix) {
    const date = new Date();
    const dateInyyMMdd = date.toISOString().slice(2, 10).replace(/-/g, '');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const timeInHHmm = hours + minutes;
    const randomNumbers = String(Math.floor(Math.random() * Math.pow(10, 10))).padStart(10, '0');
    const nonce = `${noncePrefix}${dateInyyMMdd}${timeInHHmm}${randomNumbers}`;
    return nonce;
};
module.exports = GenerateHeader;