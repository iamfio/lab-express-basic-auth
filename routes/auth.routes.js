const bcrypt = require("bcrypt");
const router = require("express").Router();

const User = require("../models/User.model");

const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");
const { default: mongoose } = require("mongoose");

/*
  module globals
*/
const saltRounds = 10;

router.get("/signup", isLoggedOut, async (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", isLoggedOut, async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("auth/signup", {
      errorMessage: "username and password required",
    });
  }

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = await User.create({ username, passwordHash });

    req.session.user = user;
    req.session.isAuthenticated = true;

    res.redirect("/dashboard");
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(500).render("auth/signup", { errorMessage: err.message });
    } else if (err.code === 11000) {
      res.status(500).render("auth/signup", {
        errorMessage: "username is already taken.",
      });
    } else {
      next(err);
    }
  }
});

router.get("/login", isLoggedOut, (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", isLoggedOut, async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    const validated = bcrypt.compareSync(password, user.passwordHash);

    if (validated) {
      req.session.user = user;

      res.redirect("/dashboard");
    } else {
      console.log("wrong password");
      res.redirect("/");
    }
  } catch (err) {
    next(err);
  }
});

router.post("/logout", isLoggedIn, (req, res, next) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
