const executor = require("../../config/db.js");
const Email = require("./email.js");

const Points = async (userid, amount,email) => {
  let points;
  if (!userid || !amount) {
    return false;
  }
  if (Number(amount) > 1000) {
    points = 4;
  } else {
    points = 2;
  }

  try {
    const query = `UPDATE users SET points = points + ?,loyalty = loyalty + ? where userid = ?`;
    await executor(query, [points,userid]);
    Email(email,points)
    return true
  } catch (error) {
    return false
  } finally {
  }
};

module.exports = Points;
