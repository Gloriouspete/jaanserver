const { check, validationResult } = require("express-validator");

 const validateAirtimeRequest = [
    check('netcode')
      .exists().withMessage('Network code is required') // Ensure netcode exists
      .isAlphanumeric().withMessage('Network code must be alphanumeric'), // Ensure it’s alphanumeric
  
    check('amount')
      .exists().withMessage('Amount is required') // Check if amount exists
      .isNumeric().withMessage('Amount must be a number'),
  
    check('number')
      .exists().withMessage('Phone number is required') // Ensure number exists
      .isMobilePhone('any').withMessage('Invalid phone number format'), // Validate phone number format
  ];

 const validateAmount = [
    check("amount")
      .exists()
      .withMessage("Amount is required")
      .isNumeric()
      .withMessage("Amount must be a number")
      
  ];

  const validateDataRequest = [
    check('netcode')
      .exists().withMessage('Network code is required') // Ensure netcode exists
      .isAlphanumeric().withMessage('Network code must be alphanumeric'), // Ensure it’s alphanumeric
  
    check('dataplan')
      .exists().withMessage('Data plan is required') // Check if dataplan exists
      .isString().withMessage('Data plan must be a string'), // Ensure it’s a string
  
    check('number')
      .exists().withMessage('Phone number is required') // Ensure number exists
      .isMobilePhone('any').withMessage('Invalid phone number format'), // Validate phone number format
  
    check('dataamount')
      .exists().withMessage('Data amount is required') // Check if dataamount exists
      .isNumeric().withMessage('Data amount must be a number') // Ensure it's a number
      .isInt({ gt: 0 }).withMessage('Data amount must be greater than 0'), // Ensure it's greater than 0
  ];
  
  module.exports = {validateAmount,validateAirtimeRequest,validateDataRequest}