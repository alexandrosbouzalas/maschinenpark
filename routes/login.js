const express = require("express");
const router = express.Router();
const redis = require("redis");
const sanitize = require("mongo-sanitize");
const { bcryptCompare } = require("../public/js/utils");
const { validatePassword } = require("../public/js/utils");
const { validateUserId } = require("../public/js/utils");
const User = require("./../models/user");

const redisPort = process.env.port || 6379;
const redisClient = redis.createClient(redisPort);

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use("./public/js/utils", bcryptCompare);
router.use("./public/js/utils", validatePassword);
router.use("./public/js/utils", validateUserId);

router.use(function (req, res, next) {
  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);
  next();
});

router.get("/", (req, res) => {
  if (req.session.authenticated) res.redirect("/home");
  else res.render("login/login");
});

router.post("/", async (req, res) => {
  const { userId, password } = req.body.data;
  console.log(req.body.data.userId);

  try {
    var user;
    
    user = await User.findOne({ userId: userId.toUpperCase() })

    if (!validatePassword(password.toString()))
      throw new Error("Falsches Passwort Format");

    if (userId && password) {
      if (req.session.authenticated) {
        res.json(req.session);
      } else {

        if (user) {

          const valid = await bcryptCompare(password, user);

          if (!valid) throw new Error("Falsches Passwort")
          else {
            req.session.authenticated = true;
            req.session.user = {
              userId,
            };

            res.status(200).json(req.session);
          }     
        }  else {
          throw new Error("User nicht gefunden");
        }       
      }
    } else {
      throw new Error("Fehlende Parameter");
    }
  } catch (e) {
    console.log(e.message);
    if (
      e.message.includes("Wrong") ||
      e.message.includes("not found") ||
      e.message.includes("undefined") ||
      e.message.includes("Invalid")
    ) {
      res.status(403).json({
        msg: "Die UserId oder das Passwort sind inkorrekt",
      });
    } else {
      res.status(500).json({
        msg: "There was a problem processing your request",
      });
    }
    console.log(e.message);
  }
});

module.exports = router;
