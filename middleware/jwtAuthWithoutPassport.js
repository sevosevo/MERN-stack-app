const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    //Get header with it's value
    const header = req.headers['authorization'];
    //Extract token. This is like setting up fromAuthHeaderAsBearerToken from passport
    const token = header.split(' ')[1];
	
    if(!token) {
        return res.status(404).json({msg: 'No token found. Authorization fails.'});
    }

    try{

        const decoded = jwt.verify(token, config.get('jwtSecret'));

        req.user = decoded.user; //Is not full object 
        
        next();

    }catch(err){

        res.status(403).json({msg: 'Token is invalid. Authorization fails.'});

    }

}