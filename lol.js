require("dotenv").config();
const secretKey = process.env.SECRET
const jwt = require("jsonwebtoken");

const func = (password) =>{
    const token = jwt.sign({ password }, secretKey);
    console.log(token)
}

const gete =() =>{
    const date = new Date()
   
    console.log(date.toISOString().slice(0,19).replace("T"," "))
}
gete()