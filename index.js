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
const Editdata = require("./admin/price/changedata.js");
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
const { validateAirtimeRequest, validateDataRequest, validateAmount, validateAllDataRequest } = require("./validator.js");
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
const PayWebhook = require("./routes/paywebhook/index.js");
const Getalldata = require("./routes/getalldata/index.js");
const BuyAlldata = require("./routes/alldata/index.js");
const Getdataprice = require("./admin/price/data.js");
const VendAirtime = require("./vendor/airtime/index.js");
const VendAuth = require("./vendor/auth/index.js");
const Venddata = require("./vendor/venddata/index.js");
const GetVenddata = require("./vendor/getdata/getdata.js");
const FetchInfo = require("./vendor/fetchinfo/index.js");
const AuthVend = require("./middleware/authvend.js");
const GetSecrets = require("./routes/secrets/fetchsecret.js");
const CreateSecret = require("./routes/secrets/createsecret.js");
const Business = require("./admin/business/index.js");
const Emailverify = require("./admin/email/index.js");
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
    const { settlementAmount: payment, paidOn: date, paymentReference } = eventData;
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

app.post("/paywebhook", PayWebhook)

app.post("/api/v1/signup", Signup);

app.post("/api/v1/login", Login);

app.post("/api/v1/createpin", authenticateJWT, Createpin);

app.post("/api/v1/setpin", authenticateJWT, Setpin);

app.post("/api/v1/forgot", Forgot);

app.post("/api/v1/resetpass", Resetpass);

app.post("/api/v1/setpass", authenticateJWT, Setpass);

app.post("/api/v1/getdata", authenticateJWT, Getdata);

app.post("/api/v1/getalldata", authenticateJWT, Getalldata);

app.post("/api/v1/buyairtime", authenticateJWT, validateAirtimeRequest, requestLimiter, speedLimiter, Airtime);

app.get("/api/v1/getuser", authenticateJWT, Getuser);

app.post("/api/v1/buydata", authenticateJWT, validateDataRequest, requestLimiter, speedLimiter, Buydata);

app.post("/api/v1/alldata", authenticateJWT, validateAllDataRequest, requestLimiter, speedLimiter, BuyAlldata);

app.post("/api/v1/getcable", authenticateJWT, Getcable);

app.post("/api/v1/geteducation", authenticateJWT, Geteducation);

app.get("/api/v1/getelectric", authenticateJWT, Getelectric);

app.get("/api/v1/getbetting", authenticateJWT, Getbetting);

app.get("/api/v1/getgiftcard", authenticateJWT, Getcard);

app.post("/api/v1/buyeducation", authenticateJWT, Buyeducation);

app.post("/api/v1/buycable", authenticateJWT, speedLimiter, requestLimiter, Buycable);

app.post("/api/v1/buyelectric", authenticateJWT, speedLimiter, requestLimiter, Buyelectric);

app.post("/api/v1/buybetting", authenticateJWT, speedLimiter, requestLimiter, Buybetting);

app.post("/api/v1/buygiftcard", authenticateJWT, speedLimiter, requestLimiter, Buygiftcard);

app.post("/api/v1/kyc", authenticateJWT, Kyc);

app.post("/api/v1/genaccount", authenticateJWT, Genaccount);

app.get("/api/v1/getprice", authenticateJWT, GetPrice);

app.get("/api/v1/getpopup", authenticateJWT, GetPopup);

app.post("/api/v1/createcoupon", authenticateJWT, validateAmount, requestLimiter, speedLimiter, Createcoupons);

app.post("/api/v1/redeemcoupon", authenticateJWT, requestLimiter, speedLimiter, Redeemcoupon);

app.post("/api/v1/verifycable", authenticateJWT, Verifycable);

app.post("/api/v1/verifyelectric", authenticateJWT, Verifyelectric);

app.post("/api/v1/verifybet", authenticateJWT, Verifybet);

app.get("/api/v1/genemail", authenticateJWT, Genemail);

app.get("/api/v1/getadverts", authenticateJWT, Viewadvert)

app.get("/admin/getusers", authenticateJWT, Getusers);

app.post("/admin/login", AdminLogin);

app.get("/admin/getbalance", authenticateJWT, Getbalance);

app.get("/admin/totalfund", authenticateJWT, Totalfunds);

app.post("/admin/deleteuser", authenticateJWT, Deleteuser);

app.post("/admin/banuser", authenticateJWT, Banuser);

app.post("/admin/emailverify", authenticateJWT, Emailverify);

app.post("/admin/unbanuser", authenticateJWT, Unbanuser);

app.post("/admin/checkuser", authenticateJWT, Checkuser);

app.post("/admin/manualfund", authenticateJWT, Manualfund);

app.get("/admin/transactions", authenticateJWT, Transaction);

app.get("/admin/alltransactions", authenticateJWT, Alltrans);

app.post("/admin/setpin", authenticateJWT, Setpins);

app.get("/admin/getdata", authenticateJWT, Getadmindata);

app.post("/admin/editprice", authenticateJWT, Editprice);

app.post("/admin/editcable", authenticateJWT, Editcable);

app.post("/admin/editdata", authenticateJWT, Editdata);

app.post("/admin/editelectric", authenticateJWT, Editelectric);

app.get("/admin/electricprice", authenticateJWT, Getelectricprice);

app.get("/admin/cableprice", authenticateJWT, Getcableprice);

app.get("/admin/dataprice", authenticateJWT, Getdataprice);

app.get("/admin/datatransaction", authenticateJWT, Datatransaction);

app.get("/admin/airtimetransaction", authenticateJWT, Airtimetransaction);

app.post("/admin/createcoupon", authenticateJWT, Createcoupon);

app.post("/admin/deletecoupon", authenticateJWT, Deletecoupon);

app.post("/admin/createmessage", authenticateJWT, Createmessage);

app.post("/admin/deletemessage", authenticateJWT, Deletemessage);

app.get("/admin/viewcoupon", authenticateJWT, Viewcoupon);

app.get("/admin/viewmessage", authenticateJWT, Viewmessage);

app.get("/admin/getadverts", authenticateJWT, Viewadverts);

app.post("/admin/createadvert", authenticateJWT, Createadvert);

app.post("/admin/deleteadvert", authenticateJWT, DeleteAdvert);

app.post("/admin/business", authenticateJWT, Business);

app.post("/admin/changeadvertstatus", authenticateJWT, ChangeAdvertStatus)

app.get("/api/v1/getrefid", authenticateJWT, GetRefid);

app.get("/api/v1/getref", authenticateJWT, GetReferrals);

app.post("/api/v1/convertpoints", authenticateJWT, validateAmount, Convertpoints);

app.post("/api/v1/verifyacc", authenticateJWT, Verifyacc);
app.post("/api/v1/checkverify", authenticateJWT, Checkverify);

app.get("/api/v1/fetchsecrets", authenticateJWT, GetSecrets);

app.get("/api/v1/createsecret", authenticateJWT, CreateSecret);

app.get("/vend/v1/auth", VendAuth);

app.post("/vend/v1/dataplan", AuthVend, GetVenddata);

app.post("/vend/v1/fetchinfo", AuthVend, FetchInfo);

app.post("/vend/v1/buydata", AuthVend, Venddata);

app.post("/vend/v1/buyairtime", AuthVend, VendAirtime);


app.get("/api/v1/transactions", authenticateJWT, (req, res) => {
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



app.get("/api/v1/callbalance", authenticateJWT, async (req, res) => {
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
