const executor = require("../../config/db.js");
require('dotenv').config()
const jwt =  require('jsonwebtoken');
const generateVerificationCode = require('../../services/verifycode.js');
const secretKey = process.env.SECRET;

async function Resetpass(req, res) {
    const { password, param } = req.body;
    const decoded = jwt.verify(param,secretKey);
    if(!decoded){
        return res.json({success:false , message:'Expired or incorrect link , try requesting again'})
    }
    const query = `SELECT userid, password FROM users WHERE email = ?`
    executor(query, [decoded.email])
        .then(async results => {
            if (results.length === 0) {
                return res.json({ success: false, message: 'User not found, Try requesting for a link later' });
            }
            const user = results[0];
            const userid = user.userid;
            const hashedpassword = jwt.sign({password},secretKey)
            if (userid) {
                const query = `UPDATE users SET password = ? where userid = ?`;
                await executor(query,[hashedpassword,userid])
                console.log('Redirecting');
                return res.status(200).json({success:true, message: 'Password Successfully Changed.'});
            }
        })
        .catch((error) => {
            console.error('Error finding user credentials:', error);
            return res.status(500).json({ error: 'Internal server error' });
        });
}

module.exports = Resetpass;