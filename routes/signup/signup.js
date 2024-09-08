const executor = require("../../config/db.js");
const getAccount = require("../../account.js");
const { welcome, sendVerificationEmail } = require("../../email.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const generateUniqueUserID = require("../../services/generate.js");
const secretKey = process.env.SECRET;
async function Signup(req, res) {
  const { name, username, phone, password, email, referrer } = req.body;
  try {
    // Check if the phone number already exists
    const phoneQuery =
      "SELECT COUNT(*) AS phoneCount FROM users WHERE phone = ?";
    const emailQuery =
      "SELECT COUNT(*) AS emailCount FROM users WHERE email = ?";

    const [phoneResults, emailResults] = await Promise.all([
      executor(phoneQuery, [phone]),
      executor(emailQuery, [email]),
    ]);

    const phoneCount = phoneResults[0].phoneCount;
    const emailCount = emailResults[0].emailCount;

    if (phoneCount > 0) {
      console.log("The phone number already exists");
      return res.status(400).json({
        success: false,
        message: "This phone Already exists",
        data: null,
      });
    }

    if (emailCount > 0) {
      console.log("The email already exists");
      return res.status(400).json({
        success: false,
        message: "This Email Already exists",
        data: null,
      });
    }

    const userid = generateUniqueUserID();
    const token = jwt.sign({ userid }, secretKey);
    const hashed = jwt.sign({ password }, secretKey);

    const response = await getAccount(userid, email, name);

    if (!response) {
      return res.status(500).json({
        success: false,
        message:
          "There is an issue generating an automatic account for you, please try again later",
        data: null,
      });
    }

    const mydata = response.data;
    const hashedemail = jwt.sign({ email }, secretKey);

    const { bankName, accountNumber } = mydata;

    const customerbankname = "Jaan - " + name.slice(0, 3);
    const refcode = generateReferralId();

    const insertUserQuery =
      "INSERT INTO users (name, user_name, password, email, phone, status, credit, userid,pin,bankname,accountnumber,accountname,refer_by,refer_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?)";

    await executor(insertUserQuery, [
      name,
      username,
      hashed,
      email,
      phone,
      "active",
      0,
      userid,
      "1234",
      bankName,
      accountNumber,
      customerbankname,
      referrer.toString(),
      refcode,
    ]);

    console.log("Inserted user into the database successfully");
    welcome(email, name);
    const hashedlink = `https://jaan.ng/verifyemail?q=${hashedemail}`;
    sendVerificationEmail(email, name, hashedlink);
    await Addcredit(referrer);
    return res
      .status(200)
      .json({ success: true, message: "Congratulations! Your signup was successful", data: token });
  } catch (error) {
    console.error("Error during user signup:", error);
    return res.status(500).json({
      success: false,
      message: "We are currently unable to sign you up, please try again later",
      data: null,
    });
  }
}
const Addcredit = async (refid) => {
  try {
    const first = `SELECT * FROM users WHERE refer_code = ?`;
    const results = await executor(first, [refid]);
    if (results.length === 0) {
      return false;
    }
    const { userid, phone } = results[0];

    const query = `UPDATE users SET credit = credit + ? WHERE refer_code = ?`;
    await executor(query, [100, refid]);
    console.log("Gave referral 100 credit already");

    const data = {
      userid,
      phone,
      deposit: "funding",
      Status: "successful",
      amount: 100, // Assuming the amount to be added is 100
      date: gete(),
    };
    await setpayment(data);
    return true;
  } catch (error) {
    console.log("Error inserting credit", error);
    return false;
  }
};

const setpayment = async (data) => {
  const { userid, phone, deposit, Status, amount, date } = data;

  try {
    const query = `INSERT INTO transactions(userid, recipient, service, status, price, date, name) VALUES (?,?,?,?,?,?,?)`;
    const results = await executor(query, [
      userid,
      phone,
      deposit,
      Status,
      amount,
      date,
      "Referral Bonus",
    ]);
    console.log("Transaction successful!", results);
    return true;
  } catch (error) {
    console.log("Error setting transaction", error);
    throw error;
  }
};

const gete = () => {
  const date = new Date();
  return date.toISOString();
};

function generateReferralId() {
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

module.exports = Signup;
