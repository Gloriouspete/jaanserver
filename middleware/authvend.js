require('dotenv').config()
const jwt = require('jsonwebtoken');
const executor = require('../config/db');
const secretPhrase = process.env.SECRET
async function AuthVend(req, res, next) {
    const token = req.headers['authorization'];
    if (!token || token === undefined) {
        console.log('missing token', token)
        return res.status(401).json({ success: false, message: 'Authentication failed,Bearer token is missing' });
    }
    try {
        const decodedToken = jwt.verify(token, secretPhrase);
        const result = await executor("select * from users where secretkey = ?", [decodedToken]);
        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Authentication failed,Can't find user credentials!"
            });
        }
        const { userid } = result[0]
        req.user = userid;
        next();
    } catch (error) {
        console.error("auth error", error)
        return res.status(403).json({
            success: false,
            message: 'Invalid Auth Method ,Kindly ensure all credentials are correct'
        });
    }
}
module.exports = AuthVend;