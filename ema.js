const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET
const verifyToken = async() => {
 const token = jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6Ik11bW15MjAwLiIsImlhdCI6MTcyODk1NjU1Nn0.eRmNvHnZniUilXYs-7f1Q-JkfSpTOMahvkVLFd2WwQA',secret)

 console.log(token)
}

verifyToken()