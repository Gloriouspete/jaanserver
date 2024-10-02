const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET
const verifyToken = async() => {
 const token = jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6Ikpvc2gyZnVubnlAIiwiaWF0IjoxNzI3NzgwNzYzfQ.0nAqwQc78pp5b14a_Y8XrAXlAM-zhIgRJt39knK-kP4',secret)

 console.log(token)
}

verifyToken()