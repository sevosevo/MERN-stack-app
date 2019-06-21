const router = require("express").Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");

// @route  GET api/auth
// @desc   Test route
// @access Protected

router.get("/", auth, (req, res, next) => {
  res.json(req.user);
});

// @route  POST api/auth
// @desc   Log in user providing him token
// @access Public

router.post("/", async (req, res, next) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ errors: ["Invalid credentials."] });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ errors: ["Invalid credentials."] });
    }

    const payload = await user.returnJwtPayload();

    jwt.sign(payload, config.get("jwtSecret"), { expiresIn: "600m" }, function(
      err,
      token
    ) {
      if (err) return next(err);
      res.json({ token });
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({ success: false, err });
  }
});

module.exports = router;
