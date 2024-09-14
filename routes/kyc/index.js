const executor = require("../../config/db.js");
require("dotenv").config();
async function Kyc (req, res) {
    const { type, number } = req.body
    const userid = req.user.userid;
    try {
        const response = await updateKyc(userid, type, number)
        console.log(response)
        const respons = executor(`update users set verified = ? where userid = ?`, ['yes', userid])
        return res.status(200).json({
            "success": true,
            "message": "Your Identity is successfully Verified",
            "data": null
        })
    }
    catch (error) {
        console.log(error)
        return res.status(200).json({
            "success": false,
            "message": error,
            "data": null
        })
    }
}
const updateKyc = async (userid, type, number) => {
    const API_KEY = process.env.MONNIFY_CLIENT
    const SECRET_KEY = process.env.MONNIFY_SECRET;
    const credentials = `${API_KEY}:${SECRET_KEY}`;
    const encodedCredentials = Buffer.from(credentials).toString('base64');
    const authHeader = `Basic ${encodedCredentials}`;

    const loginEndpoint = 'https://api.monnify.com/api/v1/auth/login';

    try {
        const loginResponse = await axios.post(loginEndpoint, {}, {
            headers: {
                'Authorization': authHeader
            }
        });

        const accessToken = loginResponse.data.responseBody.accessToken;
        const phonenumber = '1235689'; // Replace with actual phone number
        const url = `https://api.monnify.com/api/v1/bank-transfer/reserved-accounts/${userid}/kyc-info`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        };

        const requestBody = {};

        if (type === "bvn") {
            requestBody.bvn = number;
        }

        if (type === "nin") {
            requestBody.nin = number;
        }

        const response = await axios.put(url, requestBody, { headers });
        const responseData = response.data;
        console.log(responseData,'just knoe');

        if (responseData.requestSuccessful) {
            const message = responseData.responseMessage;

            const result = {
                success: true,
                data: message
            }
            return result;
        } else {
            throw new Error('Error creating account');
        }
    } catch (error) {
        const theerror = error.response ? error.response.data.responseMessage : error.message;
        console.error(theerror,'juffftt');
        //  console.log(error.response.data?.responseMessage,'toooooooo reallll')
        const load = ({
            success: false,
            message: theerror,
            data: null
        })
        throw theerror;
    }
};

module.exports = Kyc;