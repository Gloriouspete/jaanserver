const Assign = require("./assign");
const paymentSuccess = require("./payment");

require("dotenv").config();
const clientSecretKey = process.env.PAYSTACK_SECRET;
const PayWebhook = async (req, res) => {
    const paystackSignature = req.headers["x-paystack-signature"];
    if (!paystackSignature) {
        return res.status(400).send("Missing Paystack Signature Header");
    }
    // Parse the JSON directly from req.body
    const requestBody = req.body;
    console.log(requestBody.eventData);
    const computedHash = crypto
        .createHmac("sha512", clientSecretKey)
        .update(JSON.stringify(requestBody))
        .digest("hex");

    if (paystackSignature === computedHash) {
        const { eventData } = requestBody;
        switch (eventData.event) {
            case "charge.success":
                paymentSuccess(eventData);
            case "dedicatedaccount.assign.success":
                Assign(eventData);
            default:
                console.error(eventData)
        }
        res.status(200).send("Monnify Event Verified");
    } else {
        console.log("Monnify event is invalid");
        res.status(401).send("Invalid Monnify Event");
    }
};

module.exports = PayWebhook;