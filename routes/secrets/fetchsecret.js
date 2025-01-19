const executor = require("../../config/db.js");
async function GetSecrets(req, res) {
    const { userid } = req.user;
    try {
        const results = await executor("SELECT * from users where userid = ?", [userid])
        if (results.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Server authentication failed, Contact support",
            });
        }
        const { secretkey } = results[0];
        return res.status(200).json({
            success: true,
            message: "Successfully returned",
            data: {
                publickey: userid,
                secretkey
            },
        });

    } catch (error) {
        console.error("Error finding user credentials:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching ads",
            error: "Internal server error",
        });
    }
}

module.exports = GetSecrets;