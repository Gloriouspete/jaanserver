const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET
const verifyToken = async() => {
 const token = jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6IkZsdWlkODkwIiwiaWF0IjoxNzI1NzQxMzg1fQ.g_ymnC97F2Eu9AReak0jO-T_F_vYIVkfxNqUv-g7vjw',secret)

 console.log(token)
}

verifyToken()