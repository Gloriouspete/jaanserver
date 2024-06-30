const executor = require("../../config/db.js");
require("dotenv").config();
const Setpins = (req,res) =>{
        const { pin, password } = req.body;
        const userid = req.user.userid
        const intpass = parseInt(password, 10)
        console.log(pin, password)
        const query = `SELECT password FROM users WHERE userid = ?`;
        executor(query, [userid])
            .then(results => {
                if (results.length === 0) {
                    return res.status(404).json({ error: 'User not found' });
                }
                const user = results[0];
                console.log('we got here', user)
                const userpass = user.password
                if (userpass !== intpass) {
                    console.log('Incorrect password');
                    return res.status(200).json({ message: 'Incorrect Password' });
                }
                else if (userpass === intpass) {
                    pinsetter(pin, userid)
                        .then(results => {
                            console.log(results)
                            if (results === 'approved') {
                                console.log('Redirecting');
                                return res.status(200).json({ message: 'successful' });
                            }
                            else {
                                return res.status(200).json({ message: 'Error setting Pin' });
                            }
                        })
                        .catch((error) => {
                            console.error(error)
                        })
                }
            })
            .catch((error) => {
                console.error('Error finding user credentials:', error);
                return res.status(500).json({ error: 'Internal server error' });
            })
}
const pinsetter = async (pin, userid) => {
    console.log('we also got here', pin, userid)
    try {
        const query = `UPDATE users SET pin = ? where userid = ?`;
        const results = await executor(query, [pin, userid])
        const iknow = `approved`
        return iknow;
    }
    catch (error) {
        console.error(error)
        throw error;
    }
}
module.exports = Setpins;