const executor = require("../../config/db.js");
require("dotenv").config();
const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 10 });
const Email = require("./email.js");
const Vemail = require("../../services/emailverify.js");
const { check, validationResult } = require("express-validator");

const Createcoupons = async (req, res) => {
  console.log("got here");
  const userid = req.user.userid;
  const { amount, email } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error(errors.array())
    return res.status(400).json({ success: false, message: "Input Sanitization Failed, Check the Amount value" });
  }
  try {
    const couponid = generateCouponId();
    const lockExists = await myCache.get(`couponLocks:${userid}`);
    if (lockExists) {
      console.log("Existing Transaction in progress");
      return res.status(429).json({
        success: false,
        message: "Too Many Requests",
        data: null,
      });
    }
    myCache.set(`couponLocks:${userid}`, "locked");

    const [userData] = await executor(
      "SELECT pin, phone, credit FROM users WHERE userid = ?",
      [userid]
    );

    if (!userData) {
      console.error("Account not found");
      return res.json({ success: false, message: "Account not found" });
    }

    const emailverified = await Vemail(userid);

    if (emailverified === "no") {
      console.error("Account not verified");
      return res.json({
        success: false,
        message:
          "Your email address has not been verified. Please verify your email address before proceeding with this transaction.",
      });
    };

    const limit = await checkLimit(userid);
    if (limit.success) {
      if (limit.price >= 10000) {
        return res.status(400).json({
          success: false,
          message:
            "Your Coupon Creation Limit for the day has reached its limit!",
          data: null,
        });
      }
    };

    const { pin: mypin, phone, credit,ban } = userData;
    if (ban === "yes") {
      console.error("This user has been banned");
      return res
        .status(401)
        .json({
          success: false,
          message:
            "You have been banned from using Jaan services.",
        });
    }
    console.warn("this is userdata", credit);
    const balancc = Number(credit);
    const amountcc = Number(amount);
    const newbalance = balancc - amountcc;

    if (isNaN(balancc) || isNaN(amountcc)) {
      return res.status(400).json({
        success: false,
        message: "Invalid credit or amount value",
        data: null,
      });
    }

    if (amountcc > balancc) {
      return res.status(400).json({
        success: false,
        message: "Insufficient Balance",
        data: null,
      });
    }

    if (newbalance < 0 || newbalance === undefined) {
      console.log("Insufficient funds");
      return res.status(400).json({
        success: false,
        message: "Insufficient Balance",
        data: null,
      });
    }

    const insertCouponQuery =
      "INSERT INTO coupon (couponid, amount,creator,admin) VALUES (?, ?,?,?)";

    await executor(insertCouponQuery, [couponid, amount, userid, "false"]);
    console.log("Inserted Coupon into the database successfully");
    const newdate = new Date();
    const create_date = newdate.toISOString();
    const imade = {
      userid,
      recipient: phone,
      Status: "Successful",
      network: "coupon",
      plan: couponid,
      amount,
      create_date,
    };

    await coupontran(imade);

    await executor("UPDATE users SET credit = credit - ? WHERE userid = ?", [
      amountcc,
      userid,
    ]);
    if (email) {
      await Email(email, couponid, amount);
    }
    return res.status(200).json({
      message: `You have successfully created a coupon with ID ${couponid} with amount ${amount}`,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Unable to Purchase Coupon",
      data: null,
    });
  }
};
const coupontran = async (data) => {
  const { userid, recipient, Status, network, plan, amount, create_date } =
    data;
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
async function checkLimit(load) {
  const query = `SELECT SUM(price) AS total FROM transactions where userid = ? AND service = ? and Date(date) = CURDATE();`;
  try {
    const result = await executor(query, [load, "coupon"]);
    if (result[0] && result[0].total !== null) {
      console.error(`Total price for today: ${result[0].total}`);
      return { success: true, price: result[0].total };
    } else {
      console.error("No transactions found for today.");
      return { success: true, price: 0 };
    }
  } catch (error) {
    console.error("Coupon transaction chrck failed");
    return { success: false, price: 0 };
  }
}

module.exports = Createcoupons;
