const executor = require("../../config/db.js");
const Email = require("./email.js");
async function Business(req, res) {
    const { phonenumber, value } = req.body
    if (!value) {
        return res.status(400).json({
            success: false,
            message: 'Currently unable to upgrade this user,No value set',
            data: null
        });
    }
    const query = `Select * from users where userid = ?`;
    const [userdata] = await executor(query, [phonenumber])
    const { email } = userdata;
    const selectUserQuery = `UPDATE users SET business = ? where userid = ?`;
    executor(selectUserQuery, [value, phonenumber])
        .then(results => {
            if (value === "yes") {
                Email(email)
            }
            return res.status(200).json({
                success: true,
                message: 'Successfully Upgraded the User to business',
                data: null
            });
        })
        .catch((error) => {
            console.error('Error finding user credentials:', error);
            return res.status(200).json({
                success: false,
                message: 'Currently unable to upgrade this user, Internal error',
                data: null
            });
        })
}

module.exports = Business;