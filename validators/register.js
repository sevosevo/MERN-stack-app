const { body } = require('express-validator/check');

//Validator
module.exports = {
registerValidator:[ 
    body('name')
        .not()
        .isEmpty()
        .withMessage('Name field is required.')
        .isLength({min: 4, max: 25})
        .withMessage('Name field must be between 4 and 25 characters long.'),
    body('email')
        .isEmail()
        .withMessage('Invalid email format.'),
    body('password', 'Password must be at least 6 characters long.')
    .isLength({min: 6, max: 50})
],
errorFormatter: ({ location, msg, param, value, nestedErrors }) => {
    return `Error at field '${param}' for value '${value}': ${msg}`;
}
}