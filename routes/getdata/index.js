const executor = require("../../config/db.js");
const axios = require("axios");
require('dotenv').config()
const datasecret = process.env.DATA_SECRET;
const GenerateHeader = require("../../services/generateHeader/index.js")
async function GetdataV2(req, res) {
    const { network, type } = req.body;
    try {
        const header = await GenerateHeader()
        console.log(header)
        const response = await axios.get(
            `https://sandboxapi.vendifydigital.com/api/v1/Product/Category/data-bundle`,
            {
                headers: header,
            }
        );
        const mydata = response.data;
        const products = mydata.response;
        const mtnProducts = products.filter(product => product.subCategoryCode.includes(network === "9Mobile" ? network : network.toUpperCase()));
        console.log(mtnProducts,"lol");
        res.status(200).json({ success: true, message: "successfully retrieved", data: mtnProducts })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message:"Internal server error"
        })
    }
}
module.exports = GetdataV2;
