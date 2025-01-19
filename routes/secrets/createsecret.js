const executor = require("../../config/db.js");
const crypto = require("crypto")

async function CreateSecret(req, res) {
    const { userid } = req.user;
    try {
        const results = await executor("SELECT * from users where userid = ?", [userid])
        if (results.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Server authentication failed, Contact support",
            });
        }
        const { verified, business } = results[0];
        if (verified === "no") {
            return res.status(403).json({
                success: true,
                message: "Your Kyc has to be verified before you can generate Your API keys, Kindly contact support",
                data: null,
            });
        }
        if (business === "no") {
            return res.status(403).json({
                success: true,
                message: "You haven't been upgraded to the business mode, Kindly contact support for assistane and requirement",
                data: null,
            });
        }
        const secretkey = crypto.randomBytes(12).toString('hex');
        await executor(`UPDATE users SET secretkey = ? where userid = ?`, [secretkey, userid])
        return res.status(200).json({
            success: true,
            message: "You have successfully generated a new Secret Key",
            data: secretkey,
        });

    } catch (error) {
        console.error("Error finding user credentials:", error);
        return res.status(500).json({
            success: false,
            message: "There is an issue with generating your secret key, ",
            error: "Internal server error",
        });
    }
}

module.exports = CreateSecret;