const executor = require('../config/db.js');


const UserCount = async () => {
    try {
        const query = `SELECT COUNT(*) AS rowcount FROM users `
        const result = await executor(query, [])
        if (result) {
            const newresult = result[0].rowcount
            console.log(newresult, 'see result')
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
            console.warn(result ,'see total fund')
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
        const selectUserQuery = 'SELECT * FROM transactions';
        const result = await executor(selectUserQuery, [])
        if (result) {
            console.warn(result ,'see total fund')
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
            console.warn(result ,'see total fund')
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
            console.warn(result ,'see total fund')
            const mydata = result[0].totalfund
            return mydata
        }
    }
    catch (error) {
        console.log(error)
        throw 'cant retrieve total funds'
    }
}

class All {
    
}

module.exports = { UserCount, Totalfund ,AllTran ,CreditTran,DebitTran }