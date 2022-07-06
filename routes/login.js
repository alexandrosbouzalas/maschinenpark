const express = require("express");
const router = express.Router();
const redis = require("redis");


const redisPort = process.env.port || 6379;
const redisClient = redis.createClient(redisPort);

router.use(express.json());

router.get("/", (req, res) => {
  res.render("login/login");

  /* if (req.session.authenticated) {
    res.render("home/home", { title: title });
  } else {
    res.redirect("/");
  } */
});

module.exports = router;
