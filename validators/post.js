const { body } = require('express-validator/check');

//Validator
module.exports = {
	postValidator: [ 
	    body('text')
	        .not()
	        .isEmpty()
	        .withMessage('Text field is required.')
	],
	errorFormatter: ({ location, msg, param, value, nestedErrors }) => {
	    return `${msg}`;
	}
}