const executor = require("../../config/db.js");

const Viewcoupon = async (req, res) => {
  const { userid } = req.user;
  try {
    const couponQuery = `SELECT 
      c.*, 
      COUNT(cu.couponid) AS user_count
  FROM 
      coupon c
  LEFT JOIN 
      coupon_user cu ON c.couponid = cu.couponid
  WHERE 
      c.creator = ?
  GROUP BY 
      c.couponid;
  `;
    const couponResults = await executor(couponQuery, [userid]);

    return res.status(200).json({
      message: `Successfully retrieved`,
      data: couponResults,
      success: true,
    });
  } catch (error) {
    console.error("Error during coupon creation:", error);
    res.status(500).json({
      success: false,
      message: "Error during coupon creation",
      token: null,
    });
  }
};

module.exports = Viewcoupon;
