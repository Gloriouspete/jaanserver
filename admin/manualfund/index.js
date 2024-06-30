const executor = require("../../config/db.js")
async function Manualfund (req,res) {
    const { email, amount } = req.body
    const theamount = Number(amount)
    const userid = req.user.userid;
    const selectUserQuery = `UPDATE users SET credit = credit + ${theamount} where email = ?`;
    
    executor(selectUserQuery, [email])
        .then(results => {
            return res.status(200).json({
                success: true,
                message: 'Transaction successfully completed',
                data: null
            });
        })
        .catch((error) => {
            console.error('Error finding user credentials:', error);
            return res.status(500).json({ error: 'Internal server error' });
        })
}

module.exports = Manualfund;