const executor = require("../../config/db.js")
async function Deleteuser (req,res) {
    const { phonenumber } = req.body
    const userid = req.user.userid;
    const selectUserQuery = 'DELETE FROM users where userid = ?';
    executor(selectUserQuery, [phonenumber])
        .then(results => {
            return res.status(200).json({
                success: true,
                message: 'Successfully Deleted the User',
                data: null
            });
        })
        .catch((error) => {
            console.error('Error finding user credentials:', error);
            return res.status(200).json({
                success: false,
                message: 'Currently unable to delete user',
                data: null
            });
        })
}

module.exports = Deleteuser;