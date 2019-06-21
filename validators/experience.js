const { body } = require('express-validator/check');

//Validator
module.exports = {
	experienceValidator:[ 
	    body('title')
	        .not()
	        .isEmpty()
	        .withMessage('Title field is required.'),
	    body('company')
	        .not()
	        .isEmpty()
	        .withMessage('Company field is required.'),
	    body('from')
	        .not()
	        .isEmpty()
	        .withMessage('From field is required.'),
	],
	errorFormatter: ({ location, msg, param, value, nestedErrors }) => {
	    return `${msg}`;
	}
}