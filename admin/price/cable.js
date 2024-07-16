const executor = require("../../config/db.js");

const Getcableprice = (req,res) => {
        const userid = req.user.userid;
        console.log('Received phonenumber:', userid);
        const selectUserQuery = `SELECT cableprice FROM admin where username = 'Jaan'`;
        executor(selectUserQuery, [])
            .then(results => {
                return res.status(200).json({
                    success: true,
                    message: 'User details returned',
                    data: results
                });
            })
            .catch((error) => {
                console.error('Error finding user credentials:', error);
                return res.status(500).json({ error: 'Internal server error' });
            })
    
}
module.exports = Getcableprice;