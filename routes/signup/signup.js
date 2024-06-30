const executor = require("../../config/db.js");
const getAccount = require("../../account.js");
const {welcome} = require("../../email.js")
const jwt = require('jsonwebtoken');
require('dotenv').config();
const generateUniqueUserID = require('../../services/generate.js')
const secretKey = process.env.SECRET;
 async function Signup (req,res){
        const { name, username, phone, password, email, referrer } = req.body;
        try {
            // Check if the phone number already exists
            const phoneQuery = 'SELECT COUNT(*) AS phoneCount FROM users WHERE phone = ?';
            const emailQuery = 'SELECT COUNT(*) AS emailCount FROM users WHERE email = ?';
    
            const [phoneResults, emailResults] = await Promise.all([
                executor(phoneQuery, [phone]),
                executor(emailQuery, [email])
            ]);
    
            const phoneCount = phoneResults[0].phoneCount;
            const emailCount = emailResults[0].emailCount;
    
            if (phoneCount > 0) {
                console.log('The phone number already exists');
                return res.status(400).json({
                    success: false,
                    message: 'This phone Already exists',
                    data: null
                });
            }
    
            if (emailCount > 0) {
                console.log('The email already exists');
                return res.status(400).json({
                    success: false,
                    message: 'This Email Already exists',
                    data: null
                });
            }
    
            const userid = generateUniqueUserID();
            const token = jwt.sign({ userid }, secretKey);
            const hashed = jwt.sign({ password }, secretKey);
    
            const response = await getAccount(userid, email, name);
    
            if (!response) {
                return res.status(500).json({
                    success: false,
                    message: 'There is an error signing up, please try again later',
                    data: null
                });
            }
    
            const mydata = response.data;
    
            const { bankName, accountNumber } = mydata;
            
            const customerbankname = 'Jaan - ' + name.slice(0,3);
    
            const insertUserQuery =
                'INSERT INTO users (name, user_name, password, email, phone, status, credit, userid,pin,bankname,accountnumber,accountname) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)';
    
            await executor(insertUserQuery, [name, username, hashed, email, phone, 'active', 0, userid, '1234', bankName, accountNumber, customerbankname]);
    
            console.log('Inserted user into the database successfully');
            welcome(email, name);
    
            return res.status(200).json({ success: true, message: 'Signup successful', data: token });
        } catch (error) {
            console.error('Error during user signup:', error);
            return res.status(500).json({
                success: false,
                message: 'There is an error signing up, please try again later',
                data: null
            });
        }
    
}
module.exports = Signup;