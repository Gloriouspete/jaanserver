const executor = require("../../config/db.js");
require('dotenv').config()
const jwt =  require('jsonwebtoken');
const secretKey = process.env.SECRET;
 function Login (req,res) {
        const { username, password } = req.body;
        const query = `SELECT userid, password FROM users WHERE user_name = ?`;
        executor(query, [username])
          .then((results) => {
            console.log(results)
            if (results.length === 0) {
              return res.status(404).json({
                success: false,
                message: "This username can't be identified",
                data: null,
              });
            }
            const user = results[0];
            const { userid } = user;
            const userpass = user.password;
            const unhash = jwt.verify(userpass,secretKey)
            const userpassword = unhash.password;
            const intpassword = password.trim().toString();
            if (userpassword !== intpassword) {
              console.log("Incorrect password", intpassword, userpassword);
              return res.status(403).json({
                success: false,
                message: "Incorrect Password",
                data: null,
              });
            } else if (userpassword === intpassword) {
              console.log("check numberrrrr");
              const token = jwt.sign({ userid }, secretKey);
              console.log("Redirecting");
              return res.status(200).json({
                success: true,
                message: "Login successful",
                data: token,
              });
            }
          })
          .catch((error) => {
            console.error("Error finding user credentials:", error);
            return res.status(500).json({
              success: false,
              message: "Error Logging in...",
              data: null,
            });
          });
}
module.exports = Login