const executor = require("../../config/db.js");

const Viewadvert = async (req, res) => {
  try {
    const couponQuery =
      "SELECT * FROM ad_banner";
    const couponResults = await executor(couponQuery, []);

    return res.status(200).json({
      message: `Successfully retrieved Adverts`,
      data: couponResults,
      success: true,
    });
  } catch (error) {
    console.error("Error during coupon creation:", error);
    res.status(500).json({
      success: false,
      message: "Error during adverts retrieval",
      token: null,
    });
  }
};

module.exports = Viewadvert;
