const executor = require("../../config/db.js");

const Createcoupon = async(req,res) =>{
        const {userid} = req.user;
        const { amount } = req.body;
        const couponid = generateCouponId()
    
        try {
            const couponQuery = 'SELECT COUNT(*) AS couponCount FROM coupon WHERE couponid = ?';
            const [couponResults] = await Promise.all([
                executor(couponQuery, [couponid])
            ]);
    
            const couponCount = couponResults[0].couponCount;
    
            if (couponCount > 0) {
                return res.status(402).json({ success: false, message: 'You already created this coupon, Try again', token: null });
            }
    
            const insertCouponQuery =
                'INSERT INTO coupon (couponid, amount,creator,admin) VALUES (?, ?,?,?)';
    
            await executor(insertCouponQuery, [couponid, amount,userid,"true"]);
    
            console.log('Inserted Coupon into the database successfully');
    
            return res.status(200).json({ message: `You have successfully created a coupon with ID ${couponid} with amount ${amount}`, success: true });
        } catch (error) {
            console.error('Error during coupon creation:', error);
            res.status(500).json({ success: false, message: 'Error during coupon creation', token: null });
        }
};

function generateCouponId() {
    // Helper function to generate a random capital letter
    function getRandomLetter() {
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      return letters.charAt(Math.floor(Math.random() * letters.length));
    }
  
    // Helper function to generate a random number
    function getRandomNumber() {
      return Math.floor(Math.random() * 10); // Generates a number between 0 and 9
    }
  
    // Generate three random letters
    let lettersPart = "";
    for (let i = 0; i < 3; i++) {
      lettersPart += getRandomLetter();
    }
  
    // Generate six random numbers
    let numbersPart = "";
    for (let i = 0; i < 6; i++) {
      numbersPart += getRandomNumber();
    }
  
    // Concatenate letters and numbers to form the referral ID
    const referralId = lettersPart + numbersPart;
    return referralId;
  }
module.exports = Createcoupon;