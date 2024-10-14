const executor = require("../../config/db.js");
async function Banuser(req, res) {
    const { phonenumber } = req.body
    const selectUserQuery = `UPDATE users SET ban = 'yes' where userid = ?`;
    executor(selectUserQuery, [phonenumber])
        .then(results => {
            return res.status(200).json({
                success: true,
                message: 'Successfully Banned the User',
                data: null
            });
        })
        .catch((error) => {
            console.error('Error finding user credentials:', error);
            return res.status(200).json({
                success: false,
                message: 'Currently unable to ban this user',
                data: null
            });
        })
}

module.exports = Banuser;