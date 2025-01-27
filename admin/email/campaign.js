const executor = require("../../config/db.js");
const { sendEmailCampaign } = require("../../email.js");

const EmailCampaign = async (req, res) => {
    const { emails, subject, body } = req.body;
    try {
        if (!emails || emails.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Unable to parse emails, Kindly check if correct",
                data: null,
            });
        }
        if (!body) {
            return res.status(400).json({
                success: false,
                message: "No Email Content?, Nothing to send",
                data: null,
            });
        }
        if (subject && typeof (subject) !== "string") {
            return res.status(400).json({
                success: false,
                message: "Unable to parse Subject",
                data: null,
            });
        }
        const emailStrings = emails.map((item) => item.value);
        const response = await sendEmailCampaign(emailStrings, subject, body)
        if (response) {
            return res.status(200).json({
                success: true,
                message: "Successfully sent the email campaigns",
                data: null,
            });
        }
        else{
            return res.status(400).json({
                success: false,
                message: "Unable to send email, server error",
                data: null,
            });
        }

    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "Unfortunately, Your email cant be sent",
            data: null,
        });
    }
};
module.exports = EmailCampaign;
