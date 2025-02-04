require("dotenv").config();
const axios = require("axios");
const apiKey = process.env.VEND_KEY;
const privateKey = process.env.PRIVATE_KEY;
const nonceSecret = process.env.NONCE;
const crypto = require("crypto");

async function Getelectric() {
    const nonce = generateNonce(nonceSecret);
    const dataToSign = apiKey + nonce;
    const sign = crypto.createSign('SHA256');
    sign.update(dataToSign);
    sign.end();
    const signature = sign.sign(privateKey, 'base64');
    const load = {
        productId: 9314,
        providerId: 123,
        value: 50,
        valueCurrencyId: 160,
        valueCurrencyCode: 'NGN',
        transactionTitle: "Data Purchase",
        beneficiaryTelephone: "+2349023469927",
        beneficiaryEmail: "peterninyo4@gmail.com",
        beneficiaryLastname: "ninyo",
        beneficiaryFirstname: "Peter",
        buyerLastname: "ninyo",
        buyerFirstname: "Peter",
        buyerCountry: "Nigeria",
        buyerEmail: "mcgrin1@gmail.com"
    }
    try {
        const response = await axios.get(
            `https://sandboxapi.vendifydigital.com/api/v1/Product/Category/giftcard`,
            {
                headers: {
                    'X-Api-Key': apiKey,
                    'X-Nonce': nonce,
                    'X-Signature': signature,
                    'X-Currency-Code': "NGN",
                    'X-Currency-Id': 160
                },
            }
        );
        const mydata = response.data.response;
        // const products = mydata.response;
        // const mtnProducts = products.filter(product => product.subCategoryCode.includes('MTN'));
        // console.log(mtnProducts.length);
        console.log(mydata.reverse())
    } catch (error) {
        console.error(error);
    }
}

Getelectric();

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

/**
 *   originalCurrencyId: 160,
    targetCurrencyId: 160,
    originalCurrencyCode: 'NGN',
    targetCurrencyCode: 'NGN',
    originalValue: 50,
    targetValue: 50,
    status: 1,
    category: 'Data',
    categoryCode: 'data-bundle',
    subCategory: 'Africa - Nigeria - MTN',
    subCategoryCode: 'Africa-Nigeria-MTN',
    serviceCode: 'ADA',
    brandCode: 'MTN-NG-DATA',
    productId: 9314,
    productCode: 'RG-MT611',
    providerId: 123,
    providerName: 'eVend Data Store',
    name: 'MTN - 50MB',
    description: '',
    productMoreInfoUrl: '#',
    expirationDate: '2026-12-31',
    value: 50,
    valueCurrencyId: 160,
    valueCurrencyCode: 'NGN',
    productCost: 50,
    productCostCurrencyCode: 'NGN',
    productCostCurrencyId: 160,
    sysComment: '',
 */