const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET
const verifyToken = async() => {
 const token = jwt.verify('',secret)

 console.log(token)
}

verifyToken()