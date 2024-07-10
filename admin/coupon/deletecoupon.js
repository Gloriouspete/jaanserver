const executor = require("../../config/db.js");

async function Deletecoupon(req, res) {
  const { userid } = req.user;
  const { couponid } = req.body;
  try {
    const query = `DELETE FROM coupon where couponid = ? and creator = ?`;
    await executor(query, [couponid, userid]);
    return res.json({
      success: true,
      message: "Coupon has been deleted",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Unable to delete coupon, server error",
    });
  }
}

module.exports = Deletecoupon;
