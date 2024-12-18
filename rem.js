var axios = require('axios');
require("dotenv").config();
const secretKey = process.env.RE_TEST_SECRET;
var config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api-demo.systemspecsng.com/services/connect-gateway/api/v1/vending/categories?page=0&size=40',
    headers: {
        'secretKey': secretKey
    }
};
var confige = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api-demo.systemspecsng.com/services/connect-gateway/api/v1/biller/get-biller-by-category/3',
    headers: {
        'secretKey': secretKey
    }
};
var data = {
    "billPaymentProductId": "202012122018",
    "customerId": "12345678910"
};

var configd = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api-demo.systemspecsng.com/services/connect-gateway/api/v1/vending/products?page=0&countryCode=NGA&categoryCode=electricity',
    headers: {
        'secretKey': secretKey
    },
    // data: data
};
console.log(secretKey);
axios(config)
    .then(function (response) {
        console.log(response.data);
    })
    .catch(function (error) {
        console.log(error);
    });
