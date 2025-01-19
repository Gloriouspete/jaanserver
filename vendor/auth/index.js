require('dotenv').config()
const jwt = require('jsonwebtoken');
const executor = require('../../config/db');
const secretPhrase = process.env.SECRET;
function VendAuth(req, res) {
    const publicKey = req.headers['publickey'];
    const secretKey = req.headers['secretkey'];
    if (!publicKey || secretKey === undefined) {
        console.error('missing public key from vendor')
        return res.status(401).json({ success: false, message: 'Auth failed. Public Key Missing' });
    }
    if (!secretKey || secretKey === undefined) {
        console.error('missing public key from vendor')
        return res.status(401).json({ success: false, message: 'Auth failed. Secret Key Missing' });
    }

    executor("select * from users where userid = ?", [publicKey])
        .then((results) => {
            if (!results || results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "This User can't be identified, Kindly ensure credentials are correct",
                    data: null,
                });
            }
            const { secretkey } = results[0];
            if (secretKey !== secretkey) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication Failed. Incorrect secretKey",
                    data: null,
                });
            }
            const token = jwt.sign(secretkey, secretPhrase);
            return res.status(200).json({
                success: true,
                message: "Authentication Successful ✅",
                data: token,
            });

        })
        .catch((error) => {
            console.error("Error finding user credentials:", error);
            return res.status(500).json({
                success: false,
                message: "Authentication failed, Contact Support for assistance",
                data: null,
            });
        });
}
module.exports = VendAuth;