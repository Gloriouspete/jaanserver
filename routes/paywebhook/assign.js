const executor = require("../../config/db");

const Assign = async (eventData) => {
  console.error(eventData)
  try {
    const data = eventData.data;
    const email = data.customer.email;
    const bankName = data.dedicated_account.bank.name;
    const accountName = data.dedicated_account.account_name;
    const accountNumber = data.dedicated_account.account_number;
    await setBank(bankName, accountNumber, accountName, email)
  }
  catch (error) {
    console.error(error);
  }
}
module.exports = Assign;

const setBank = async (bankname, accountnumber, name, email) => {
  try {
    const customerbankname = name;
    const query = `UPDATE users SET bankname = ? , accountnumber = ?, accountname = ?,verified = ? where email = ? `;
    executor(query, [bankname, accountnumber, customerbankname, "yes", email]).then((response) => {
      return true;
    });
  } catch (error) {
    console.log(error);
    return false;
  }
};