const express = require("express");
const http = require("http");
const crypto = require("crypto");
const executor = require("./config/db.js");
require("dotenv").config();
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8080;
const datasecret = process.env.DATA_SECRET;
const { forgot, welcome } = require("./email.js");
const cors = require("cors");
const authenticateJWT = require("./middleware/auth.js");
const multiply = 1.1;
const Signup = require("./routes/signup/signup.js");
const Login = require("./routes/login/login.js");
const Createpin = require("./routes/createpin/createpin.js");
const Setpin = require("./routes/setpin/setpin.js");
const Forgot = require("./routes/forgot/forgot.js");
const Setpass = require("./routes/setpass/setpass.js");
const Getdata = require("./routes/getdata/getdata.js");
const Getuser = require("./routes/getuser/getuser.js");
const Airtime = require("./routes/airtime/airtime.js");
const Buydata = require("./routes/buydata/index.js");
const Getcable = require("./routes/getcable/index.js");
const Getelectric = require("./routes/getelectric/index.js");
const Buycable = require("./routes/buycable/index.js");
const Buyelectric = require("./routes/buyelectric/index.js");
const AdminLogin = require("./admin/login/index.js");
const Getusers = require("./admin/getusers/index.js");
const Totalfunds = require("./admin/totalfund/index.js");
const Deleteuser = require("./admin/deleteuser/index.js");
const Checkuser = require("./admin/checkuser/index.js");
const Manualfund = require("./admin/manualfund/index.js");
const Transaction = require("./admin/transactions/index.js");
const Alltrans = require("./admin/alltrans/index.js");
const Setpins = require("./admin/setpin/index.js");
const Getbalance = require("./admin/getbalance/index.js");
const Getadmindata = require("./admin/getdata/index.js");
const Airtimetransaction = require("./admin/airtimetransaction/index.js");
const Datatransaction = require("./admin/datatransaction/index.js");
const Editdata = require("./admin/editdata/index.js");
const Getcableprice = require("./admin/price/cable.js");
const Getelectricprice = require("./admin/price/electric.js");
const Editcable = require("./admin/price/changecable.js");
const Editelectric = require("./admin/price/changeelec.js");
const GetPrice = require("./routes/price/price.js");
const Resetpass = require("./routes/resetpass/reset.js");
const Genaccount = require("./routes/genaccount/index.js");
const Kyc = require("./routes/kyc/index.js");
const GetRefid = require("./routes/referral/getrefid.js");
const GetReferrals = require("./routes/referral/getref.js");
const Createcoupon = require("./admin/coupon/createcoupon.js");
const Deletecoupon = require("./admin/coupon/deletecoupon.js");
const Createcoupons = require("./routes/coupon/create.js");
const Deletemessage = require("./admin/message/delete.js");
const Createmessage = require("./admin/message/create.js");
const GetPopup = require("./routes/popup/index.js");
const Viewcoupon = require("./admin/coupon/viewcoupon.js");
const Viewmessage = require("./admin/message/viewmessage.js");
const Redeemcoupon = require("./routes/coupon/redeem.js");
const Editprice = require("./admin/editdata/index.js");
const Verifycable = require("./routes/verifycable/index.js");
const Convertpoints = require("./routes/points/redeem.js");
const Verifyelectric = require("./routes/verifyelectric/index.js");
const Verifyacc = require("./routes/verifyacc/index.js");
const { Server } = require("socket.io");
const Chat = require("./routes/sockets/chat.js");
const Checkverify = require("./routes/checkverify/index.js");
const Geteducation = require("./routes/geteducation/index.js");
const Buyeducation = require("./routes/buyeducation/index.js");
const Genemail = require("./routes/genemail/index.js");
const Getbetting = require("./routes/getbetting/index.js");
const { validateAirtimeRequest, validateDataRequest, validateAmount } = require("./validator.js");
const Banuser = require("./admin/banuser/index.js");
const Unbanuser = require("./admin/unbanuser/index.js");
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const Viewadvert = require("./routes/adverts/viewadvert.js");
const Viewadverts = require("./admin/adverts/viewadvert.js");
const Createadvert = require("./admin/adverts/create.js");
const DeleteAdvert = require("./admin/adverts/delete.js");
const ChangeAdvertStatus = require("./admin/adverts/changestatus.js");
const Verifybet = require("./routes/verifybet/index.js");
const Buybetting = require("./routes/buybetting/index.js");
const Getcard = require("./routes/getcard/index.js");
const Buygiftcard = require("./routes/buygiftcard/index.js");
const requestLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 1, // Limit each user to 1 coupon creation per window
  message: "You can only make one request every 10 seconds.",
});
const speedLimiter = slowDown({
  windowMs: 10 * 1000, // 10 seconds
  delayAfter: 1, // Delay after 1 request
  delayMs: () => 1000, // Delay of 1 second per additional request
});

const io = new Server(server, {
  cors: {
    origin: "https://jaan.ng ",
  },
});

corsOptions = {
  //origin: ["https://jaan.ng","https://www.jaan.ng","www.jaan.ng", "https://admin.jaan.ng"],
  origin: "*",
  methods: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  allowedHeaders: "Origin, Content-Type,Authorization, X-Auth-Token",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(authenticateJWT);

app.get("/", (req, res) => {
  res.send("Server is working correctly");
});
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const setpayment = async (data) => {
  const { userid, phone, deposit, Status, amount, create_date } = data;

  try {
    const query = `INSERT INTO transactions(userid,recipient, service, status, price, date,name) VALUES (?,?,?,?,?,?,?)`;
    const results = await executor(query, [
      userid,
      phone,
      deposit,
      Status,
      amount,
      create_date,
      "Bank funding",
    ]);
    console.log("successful!", results);
    // Assuming you want to return the results
  } catch (error) {
    console.log("error setting transaction");
    throw error; // Re-throw the error to propagate it
  }
};

const paymentSuccess = async (userid, amount, date) => {
  try {
    const query = `SELECT phone, credit FROM users WHERE userid = ?`;
    const results = await executor(query, [userid]);

    if (results.length === 0) {
      throw new Error("User not found");
    }

    const user = results[0];
    const { phone, credit } = user;
    const balance = parseInt(credit, 10);
    const parsedAmount = parseInt(amount, 10);
    const plusedamount = balance + parsedAmount;

    const anotherquery = `UPDATE users SET credit = ? WHERE userid = ?`;
    await executor(anotherquery, [plusedamount, userid]);

    const deposit = "Funding";
    const Status = "successful";
    const newdate = new Date();
    const create_date = newdate.toISOString();
    const imade = { userid, phone, deposit, Status, amount, create_date };

    await setpayment(imade);
    return Status;
  } catch (error) {
    console.error("Error in paymentSuccess:", error);
    return "failed";
  }
};

const processedTransactions = new Set();

app.post("/webhooksuccess", async (req, res) => {
  const monnifySignature = req.get("monnify-signature");
  if (!monnifySignature) {
    return res.status(400).send("Missing Monnify Signature Header");
  }
  const clientSecretKey = process.env.MONNIFY_SECRET;

  // Parse the JSON directly from req.body
  const requestBody = req.body;
  console.log(requestBody.eventData);

  const computedHash = crypto
    .createHmac("sha512", clientSecretKey)
    .update(JSON.stringify(requestBody))
    .digest("hex");

  if (monnifySignature === computedHash) {
    const { eventData } = requestBody;
    const { amountPaid: payment, paidOn: date, paymentReference } = eventData;
    const { reference } = eventData.product;

    if (processedTransactions.has(paymentReference)) {
      console.log("Transaction already processed:", reference);
      return res.status(200).send("Transaction already processed");
    }

    const result = await paymentSuccess(reference, payment, date);

    if (result === "successful") {
      console.log("Monnify event is valid");
      processedTransactions.add(paymentReference);
      res.status(200).send("Monnify Event Verified");
    } else if (result === "failed") {
      res.status(403).send("Bad request");
    }
  } else {
    console.log("Monnify event is invalid");
    res.status(401).send("Invalid Monnify Event");
  }
});

app.post("/api/v1/signup", Signup);

app.post("/api/v1/login", Login);

app.post("/api/v1/createpin", Createpin);

app.post("/api/v1/setpin", Setpin);

app.post("/api/v1/forgot", Forgot);

app.post("/api/v1/resetpass", Resetpass);

app.post("/api/v1/setpass", Setpass);

app.post("/api/v1/getdata", Getdata);

app.post("/api/v1/buyairtime", validateAirtimeRequest, requestLimiter, speedLimiter, Airtime);

app.get("/api/v1/getuser", Getuser);

app.post("/api/v1/buydata", validateDataRequest, requestLimiter, speedLimiter, Buydata);

app.get("/api/v1/getcable", Getcable);

app.post("/api/v1/geteducation", Geteducation);

app.get("/api/v1/getelectric", Getelectric);

app.get("/api/v1/getbetting", Getbetting);

app.get("/api/v1/getgiftcard", Getcard);

app.post("/api/v1/buyeducation", Buyeducation);

app.post("/api/v1/buycable", speedLimiter, requestLimiter, Buycable);

app.post("/api/v1/buyelectric",speedLimiter,requestLimiter, Buyelectric);

app.post("/api/v1/buybetting", speedLimiter, requestLimiter, Buybetting);

app.post("/api/v1/buygiftcard",speedLimiter,requestLimiter, Buygiftcard);

app.post("/api/v1/kyc", Kyc);

app.post("/api/v1/genaccount", Genaccount);

app.get("/api/v1/getprice", GetPrice);

app.get("/api/v1/getpopup", GetPopup);

app.post("/api/v1/createcoupon", validateAmount, requestLimiter, speedLimiter, Createcoupons);

app.post("/api/v1/redeemcoupon", requestLimiter, speedLimiter, Redeemcoupon);

app.post("/api/v1/verifycable", Verifycable);

app.post("/api/v1/verifyelectric", Verifyelectric);

app.post("/api/v1/verifybet", Verifybet);

app.get("/api/v1/genemail", Genemail);

app.get("/api/v1/getadverts", Viewadvert)

app.get("/admin/getusers", Getusers);

app.post("/admin/login", AdminLogin);

app.get("/admin/getbalance", Getbalance);

app.get("/admin/totalfund", Totalfunds);

app.post("/admin/deleteuser", Deleteuser);

app.post("/admin/banuser", Banuser);

app.post("/admin/unbanuser", Unbanuser);

app.post("/admin/checkuser", Checkuser);

app.post("/admin/manualfund", Manualfund);

app.get("/admin/transactions", Transaction);

app.get("/admin/alltransactions", Alltrans);

app.post("/admin/setpin", Setpins);

app.get("/admin/getdata", Getadmindata);

app.post("/admin/editprice", Editprice);

app.post("/admin/editcable", Editcable);

app.post("/admin/editelectric", Editelectric);

app.get("/admin/electricprice", Getelectricprice);

app.get("/admin/cableprice", Getcableprice);

app.get("/admin/datatransaction", Datatransaction);

app.get("/admin/airtimetransaction", Airtimetransaction);

app.post("/admin/createcoupon", Createcoupon);

app.post("/admin/deletecoupon", Deletecoupon);

app.post("/admin/createmessage", Createmessage);

app.post("/admin/deletemessage", Deletemessage);

app.get("/admin/viewcoupon", Viewcoupon);

app.get("/admin/viewmessage", Viewmessage);

app.get("/admin/getadverts", Viewadverts);

app.post("/admin/createadvert", Createadvert);

app.post("/admin/deleteadvert", DeleteAdvert);

app.post("/admin/changeadvertstatus", ChangeAdvertStatus)

app.get("/api/v1/getrefid", GetRefid);

app.get("/api/v1/getref", GetReferrals);

app.post("/api/v1/convertpoints", validateAmount, Convertpoints);

app.post("/api/v1/verifyacc", Verifyacc);
app.post("/api/v1/checkverify", Checkverify);


app.get("/api/v1/transactions", (req, res) => {
  const userid = req.user.userid;
  try {
    const pquery = `select * from transactions where userid = ?`;
    executor(pquery, [userid])
      .then((results) => {
        if (results.length > 0) {
          return res.json({
            success: true,
            message: "Transaction retrieved",
            data: results,
          });
        } else {
          return res.json({
            success: false,
            message: "Unable to retrieve transaction",
            data: null,
          });
        }
      })
      .catch((error) => {
        console.log(error.response || "Error getting transactionss");
        return res.json({
          success: false,
          message: "Unable to retrieve transaction",
          data: null,
        });
      });
  } catch (error) {
    console.log(error.response || "Error getting transactionss");
    return res.json({
      success: false,
      message: "Unable to retrieve transaction",
      data: null,
    });
  }
});



app.get("/api/v1/callbalance", async (req, res) => {
  const email = req.session.email;

  const db = await pool.getConnection();
  const selectBalanceQuery = "SELECT accountbalance FROM users WHERE email = ?";
  db.query(selectBalanceQuery, [email], (err, results) => {
    if (err) {
      console.error("Error fetching account balance:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    db.release();
    const user = results[0];
    console.log(user);
    console.log("Fetched data", user);
    res.send(user);
  });
});

io.on("connection", (socket) => {
  console.log("new connection");
  Chat(socket, io);
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
