const executor = require("../../config/db.js");

const Checkuser = (req,res) => {
        const { email } = req.body
        const userid = req.user.userid;
        console.log('Received phonenumber:', userid);
    
        const selectUserQuery = `SELECT * FROM users where email = ?`;
        executor(selectUserQuery, [email])
            .then(results => {
                const transform = [];
                const resu = results.reverse();
                resu.forEach(element => {
                    transform.push(element)
                })
                console.log(transform, 'see data o')
                return res.status(200).json({
                    success: true,
                    message: 'User details returned',
                    data: transform[0]
                });
            })
            .catch((error) => {
                console.error('Error finding user credentials:', error);
                return res.status(500).json({ error: 'Internal server error' });
            })
    
}
module.exports = Checkuser;