const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");

module.exports = (app) => {
  app.set("trust proxy", 1);

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 60 * 1000, // 1 hour
      },
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 60 * 60 * 1, // 1 hour
      }),
    }),
  );

  // used to reach session from HBS layout
  // without to serve it on each route needed
  app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
  });
};
