const executor = require("../../config/db.js");

const Getadmindata = (req,res) => {
        const userid = req.user.userid;
        console.log('Received phonenumber:', userid);
        const selectUserQuery = `SELECT * FROM datatable`;
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
module.exports = Getadmindata;