const executor = require('../config/db.js');


const UserCount = async () => {
    try {
        const query = `SELECT COUNT(*) AS rowcount FROM users `
        const result = await executor(query, [])
        if (result) {
            const newresult = result[0].rowcount

            return newresult
        }
    }
    catch (error) {
        console.log(error)
        throw "Error retrieving User Count"
    }
}

const Totalfund = async () => {
    try {
        const selectUserQuery = 'SELECT SUM(credit) AS totalbalance FROM users';
        const result = await executor(selectUserQuery, [])
        if (result) {

            const mydata = result[0].totalbalance
            return mydata
        }
    }
    catch (error) {
        console.log(error)
        throw 'cant retrieve total funds'
    }
}

const AllTran = async () => {
    try {
        const selectUserQuery = 'SELECT transactions.* , users.user_name FROM transactions JOIN users ON transactions.userid = users.userid';
        const result = await executor(selectUserQuery, [])
        if (result) {
            const mydata = result.reverse()
            return mydata
        }
    }
    catch (error) {
        console.log(error)
        throw 'cant retrieve total funds'
    }
}

const CreditTran = async () => {
    try {
        const selectUserQuery = `SELECT SUM(price) as totalprice FROM transactions where service = 'funding'`;
        const result = await executor(selectUserQuery, [])
        if (result) {
            const mydata = result[0].totalprice
            return mydata
        }
    }
    catch (error) {
        console.log(error)
        throw 'cant retrieve total funds'
    }
}
const DebitTran = async () => {
    try {
        const selectUserQuery = `SELECT SUM(price) as totalfund FROM transactions where service != 'funding'`;
        const result = await executor(selectUserQuery, [])
        if (result) {
            const mydata = result[0].totalfund
            return mydata
        }
    }
    catch (error) {
        console.log(error)
        throw 'cant retrieve total funds'
    }
}

const MaximumTran = async (userid) => {
    try {

        const today = new Date().toISOString().split('T')[0];

        const selectUserQuery = `
            SELECT SUM(price) AS totalfund
            FROM transactions
            WHERE service != 'funding' 
              AND userid = ? 
              AND DATE(date) = ?;
        `;
        const result = await executor(selectUserQuery, [userid, today]);
        console.error(result,"see maximun resukt")
        if (result && result[0] && result[0].totalfund !== null) {
            return result[0].totalfund;
        }
        return 0;
    } catch (error) {
        console.error('Error fetching total funds:', error);
        throw new Error('Could not retrieve total funds for today');
    }
};



module.exports = { UserCount, Totalfund, AllTran, CreditTran, DebitTran, MaximumTran }