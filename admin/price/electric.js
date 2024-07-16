const executor = require("../../config/db.js");

const Getelectricprice = (req,res) => {
        const userid = req.user.userid;
        const selectUserQuery = `SELECT electricprice FROM admin where username = 'Jaan'`;
        executor(selectUserQuery, [])
            .then(results => {
                return res.status(200).json({
                    success: true,
                    message: 'Electric price details returned',
                    data: results
                });
            })
            .catch((error) => {
                console.error('Error finding user credentials:', error);
                return res.status(500).json({ error: 'Internal server error' });
            })
    
}
module.exports = Getelectricprice;