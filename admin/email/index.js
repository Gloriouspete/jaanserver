const executor = require("../../config/db.js");
async function Emailverify(req, res) {
    const { phonenumber } = req.body
    const selectUserQuery = `UPDATE users SET emailverified = 'yes' where userid = ?`;
    executor(selectUserQuery, [phonenumber])
        .then(results => {
            return res.status(200).json({
                success: true,
                message: 'Successfully Verified the User email',
                data: null
            });
        })
        .catch((error) => {
            console.error('Error finding user credentials:', error);
            return res.status(200).json({
                success: false,
                message: 'Currently unable to verify this user',
                data: null
            });
        })
}

module.exports = Emailverify;