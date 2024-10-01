const executor = require("../../config/db.js");
require("dotenv").config();
const NodeCache = require("node-cache");
const myCache = new NodeCache();
const Email = require("./email.js");
const Vemail = require("../../services/emailverify.js");

const Redeemcoupon = async (req, res) => {
  console.log("got here")
  const userid = req.user.userid;
  const { couponid } = req.body;
  try {
    const lockExists = myCache.get(`redeemLocks:${userid}`);
    if (lockExists) {
      console.log("Existing Transaction in progress");
      return res.status(429).json({
        success: false,
        message: "Too Many Requests",
        data: null,
      });
    }

    myCache.set(`redeemLocks:${userid}`, "locked", 10);

    const [userData] = await executor(
      "SELECT pin, phone, credit FROM users WHERE userid = ?",
      [userid]
    );
    const emailverified = await Vemail(userid);


    if (emailverified === "no") {
      console.error("Account not verified");
      return res.status(401).json({ success: false, message: "Your email address has not been verified. Please verify your email address before proceeding with this transaction." });
    }
    const [checkCoupon] = await executor(
        "SELECT * FROM coupon WHERE couponid = ?",
        [couponid]
      );
    const [checkUsed] = await executor(
        "SELECT * FROM coupon_user WHERE couponid = ?",
        [couponid]
      );
      const [checkPersonUsed] = await executor(
        "SELECT count(*) as thecount FROM coupon_user WHERE couponid = ? and userid = ?",
        [couponid,userid]
      );

    if (!userData || userData.length === 0) {
      console.error("Account not found");
      return res.status(404).json({ success: false, message: "Account not found" });
    }
    if (!checkCoupon || checkCoupon.length === 0) {
        console.error("Account not found");
        return res.status(404).json({ success: false, message: "Invalid Coupon" });
      }
    if (checkPersonUsed.thecount > 0) {
        console.error("Coupon already redeemed by user");
        return res.status(404).json({ success: false, message: "You already redeemed this coupon" });
      }
    const { user_name, phone, credit,verified } = userData;
    if (Number(credit) < 10) {
      console.error("Balance too low");
      return res.status(401).json({ success: false, message: "Your Account Balance is too low, Kindly ensure that you've top up your account with at least 100 naira to be able to claim coupon" });
    }
    if (verified === "no") {
      console.error("identity not verified");
      return res.status(401).json({ success: false, message: "Your Kyc Account has not been verified. Please go to profile to verify your Identity before proceeding with this transaction." });
    }
    const {admin,amount} = checkCoupon;
    console.warn("this is userdata", credit);
    const amountcc = Number(amount);
    if ( checkUsed && admin !== "true") {
      return res.status(400).json({
        success: false,
        message: "This coupon has been used by another user",
        data: null,
      });
    }

    const insertCouponQuery = "INSERT INTO coupon_user (userid, couponid,username) VALUES (?, ?,?)";
    const updateBalanceQuery = "UPDATE users SET credit = credit + ? where userid = ?"
    await executor(insertCouponQuery, [userid, couponid, user_name]);
    await executor(updateBalanceQuery, [amountcc, userid]);
    console.log("Updated Coupon into the database successfully");
    const newdate = new Date();
    const create_date = newdate.toISOString();
    const imade = {
      userid,
      recipient: phone,
      Status:"Successful",
      network: "coupon",
      plan:couponid,
      amount,
      create_date,
    };
    await coupontran(imade);
    return res.status(200).json({
        message: `You have successfully redeemed a coupon with ID ${couponid} with the amount of ${amount} naira`,
        success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Coupon Purchase Failed",
      data: null,
    });
  }
};
const coupontran = async (data) => {
  const { userid, recipient, Status, network,plan, amount, create_date } = data;
  // console.log(data, "see data o");

  try {
    const query = `INSERT INTO transactions(userid , recipient, status, price, date, network,plan,service) VALUES (?,?,?,?,?,?,?,?)`;
    executor(query, [
      userid,
      recipient,
      Status,
      amount,
      create_date,
      network,
      plan,
      "coupon",
    ])
      .then((results) => {
        // console.log("successfully inserted into transaction");
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.warn(error);
  }
};


module.exports = Redeemcoupon;
 