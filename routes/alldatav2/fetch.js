const executor = require("../../config/db.js");
const axios = require("axios");
require('dotenv').config()
const datasecret = process.env.DATA_SECRET;
const GenerateHeader = require("../../services/generateHeader/index.js")
async function fetchData(productId) {
    try {
        const header = await GenerateHeader()
        const response = await axios.get(
            `https://sandboxapi.vendifydigital.com/api/v1/Product/Category/data-bundle`,
            {
                headers: header,
            }
        );
        const mydata = response.data;
        const products = mydata.response;
        const Products = products.filter(product => product.productId === Number(productId));
        console.log(Products);
        return Products;
    } catch (error) {
        console.error(error);
        throw new Error(error)
    }
}
module.exports = fetchData;
