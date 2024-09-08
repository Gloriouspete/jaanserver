const executor = require('../config/db.js');


const Vemail = async (userid) => {
    try {
        const query = `SELECT emailverified FROM users where userid = ? `
        const result = await executor(query, [userid])
        if (result) {
            const newresult = result[0].emailverified;
            return newresult
        }
    }
    catch (error) {
        console.log(error)
        throw "Error retrieving email if verified"
    }
}

module.exports = Vemail;