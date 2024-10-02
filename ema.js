const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET
const verifyToken = async() => {
 const token = jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6Ikpvc2gyZnVubnlAIiwiaWF0IjoxNzI3ODIwNTU1fQ.mPXfi1TDf4Kr-j5ZXcI83zDxUmd4XXqEL53defxrVQI',secret)

 console.log(token)
}

verifyToken()