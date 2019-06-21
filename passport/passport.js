const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
const User = require('../models/User');
const config = require('config');

module.exports = (passport) => {

    let jwtOptions = {};

    //Look into the Authorization header and look for pattern: bearer <token>
    jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    
    //Secret to use
    jwtOptions.secretOrKey = config.get('jwtSecret');

    passport.use(new JwtStrategy(jwtOptions, async function(jwt_payload, next){
        try {
            const user = await User.findOne({_id: jwt_payload.user.id}).select('-password');
            
            if(user){

                next(null, user, {message: 'Acess given for the provided token.'});

            }else{

                next(null, false, {message: 'Valid token, but user doesnt exist.'});

            }
        }catch(err){

            return next(err, false, {message: 'Database error.'});

        }

    }));

}