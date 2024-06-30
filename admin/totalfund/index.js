
const { UserCount, Totalfund, AllTran, CreditTran, DebitTran } = require('../../services/worker.js');

async function Totalfunds (req,res){
    const userid = req.user.userid;
    console.log('Received phonenumber:', userid);
    try {
        const usercount = await UserCount()
        const totalfund = await Totalfund()
        const creditfund = await CreditTran()
        const debitfund = await DebitTran()

        if (totalfund && usercount) {
            return res.status(200).json({
                success: true,
                message: 'Successfully returned',
                data: { totalfund, usercount, creditfund, debitfund }
            });
        }
    }
    catch (error) {
        console.log('error is here')
    }
}
module.exports = Totalfunds;