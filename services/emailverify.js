const executor = require('../config/db.js');

const Vemail = async (userid) => {
    try {
        const query = `SELECT emailverified FROM users WHERE userid = ?`;
        const result = await executor(query, [userid]);
        if (result.length > 0) {
            console.error(result)
            // Ensure that result is an array with at least one item
            const emailVerifiedStatus = result[0].emailverified;
            return emailVerifiedStatus === 'yes' ? 'yes' : 'no';
        } else {
            
            return 'no'; 
        }
    } catch (error) {
        console.error("Error retrieving email verification status:", error);
        throw new Error("Error retrieving email verification status");
    }
}

module.exports = Vemail;
