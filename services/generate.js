const { v4 : uuidv4 } = require('uuid');

 function generateUniqueUserID() {
    // Generate a random UUID (version 4)
    const userID = uuidv4();

    return userID;
}
module.exports = generateUniqueUserID