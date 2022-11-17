const router = require("express").Router();
const { isLoggedIn } = require("../middleware/route-guard");

router.get("/dashboard", isLoggedIn, (req, res) => {
  res.render("user/dashboard", {
    user: req.session.user,
  });
});

module.exports = router;
