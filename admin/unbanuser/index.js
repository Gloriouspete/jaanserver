const executor = require("../../config/db.js");
async function Unbanuser(req, res) {
    const { phonenumber } = req.body
    const selectUserQuery = `UPDATE users SET ban = 'no' where userid = ?`;
    executor(selectUserQuery, [phonenumber])
        .then(results => {
            return res.status(200).json({
                success: true,
                message: 'Successfully Unbanned the User',
                data: null
            });
        })
        .catch((error) => {
            console.error('Error finding user credentials:', error);
            return res.status(200).json({
                success: false,
                message: 'Currently unable to unban this user',
                data: null
            });
        })
}

module.exports = Unbanuser;