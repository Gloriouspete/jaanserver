const executor = require("../../config/db.js");
const getAccount = require("../../account.js");
const {welcome} = require("../../email.js")
const jwt = require('jsonwebtoken');
require('dotenv').config();
const generateUniqueUserID = require('../../services/generate.js')
const secretKey = process.env.SECRET;
const Createuser = async(req,res) =>{
   
        const { firstname, lastname, phonenumber, password, email } = req.body;
    
        try {
            // Check if the phone number already exists
            const phoneQuery = 'SELECT COUNT(*) AS phoneCount FROM appusers WHERE phonenumber = ?';
            const emailQuery = 'SELECT COUNT(*) AS emailCount FROM appusers WHERE email = ?';
    
            const [phoneResults, emailResults] = await Promise.all([
                executor(phoneQuery, [phonenumber]),
                executor(emailQuery, [email])
            ]);
    
            const phoneCount = phoneResults[0].phoneCount;
            const emailCount = emailResults[0].emailCount;
    
            if (phoneCount > 0) {
                console.log('The phone number already exists');
                return res.status(400).json({ success: false, message: 'phonenumber', token: null });
            }
    
            if (emailCount > 0) {
                console.log('The email already exists');
                return res.status(400).json({ success: false, message: 'email', token: null });
            }
    
            const userid = generateUniqueUserID();
            const token = jwt.sign({ userid }, secretKey);
    
            const response = await getAccount(userid, email, firstname);
    
            if (!response) {
                return res.status(500).json({
                    success: false,
                    message: 'There is an error signing up, please try again later',
                    data: null
                });
            }
    
            const mydata = response.data;
    
            const { bankName, accountNumber } = mydata;
            
            const customerbankname = 'Powerpaybill'+firstname;
    
            const insertUserQuery =
                'INSERT INTO appusers (firstname, lastname, password, email, phonenumber, status, accountbalance, userid, bankname, bankaccountnumber, customerbankname) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    
            await executor(insertUserQuery, [firstname, lastname, password, email, phonenumber, 'active', 0, userid, bankName, accountNumber, customerbankname]);
    
            console.log('Inserted user into the database successfully');
             welcome(email, firstname);
    
            return res.status(200).json({ message: 'successful', token: token, success: true });
        } catch (error) {
            console.error('Error during user signup:', error);
            res.status(500).json({ success: false, message: 'Error signing Up', token: null });
        }
};
module.exports = Createuser;