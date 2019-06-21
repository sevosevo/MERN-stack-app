const router = require('express').Router();
const { validationResult } = require('express-validator/check');
const User = require('../../models/User');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const config = require('config');
//Import validator array of middlewares
const {registerValidator, errorFormatter} = require('../../validators/register');

// @route  POST api/users
// @desc   Registers a user.
// @access Public
router.post('/', registerValidator, async (req, res, next) => {
    //Using custom error formatters
    const validation = validationResult(req).formatWith(errorFormatter);

    if(!validation.isEmpty()){
        return res.status(422).json({errors: validation.array()});
    }

    const {name, email, password} = req.body;

    try{
        const userExists = await User.countDocuments({ email }) === 1;
 
        if(userExists){
            return res.status(409).json({ errors: ['User already exists.'] })
        }

        const avatar = gravatar.url(email, {
            s: '200', 
            r: 'g',
            d: 'robohash'
        });

        const user = new User({
            name,
            email,
            password,
            avatar
        });
        
        //Hashing password is method on the model
        await user.hashMe();
       
        //Save the user in database
        await user.save();
        console.log('User saved to the database.');

        //Custom method on User model. Returns payload based on instance of user. Pattern is:  user: {id : <instance.id>}
        const payload = await user.returnJwtPayload();

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn: '600m'},
            function(err, token) {
                if(err) throw err;
                //Send token 
                res.json({ token });
            }
        );

    }catch(err){
        console.error(err);

        res.status(500).json({success: false, err: 'Server error.'});
    }
});



module.exports = router;
