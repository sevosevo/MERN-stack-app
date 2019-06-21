const passport = require("passport");

module.exports = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, function(err, user, info) {
    if (err) return next(err);

    if (!user) return res.status(403).json({ errors: [info.message] });

    req.login(user, { session: false }, function(err) {
      if (err) return next(err);

      //Authenticated
      //console.log(info.message); //Success message
      //Move on to next middleware
      return next();
    });
  })(req, res, next);
};
