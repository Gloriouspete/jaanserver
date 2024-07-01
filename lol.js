require("dotenv").config();
const secretKey = process.env.SECRET
const jwt = require("jsonwebtoken");

const func = (password) =>{
    const token = jwt.sign({ password }, secretKey);
    console.log(token)
}

func('Ubbh47&0')