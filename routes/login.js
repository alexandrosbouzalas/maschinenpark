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

  try {
    var user;
    
    user = await User.findOne({ userId: userId })

    if (!validatePassword(password.toString()))
      throw new Error("Falsches Format");

    if (userId && password) {
      if (req.session.authenticated) {
        res.json(req.session);
      } else {

        if (user) {

          const valid = await bcryptCompare(password, user);

          if (!valid) throw new Error("Falsche UserID oder falsches Passwort")
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
    if (
      e.message.includes("wrong") ||
      e.message.includes("not found") ||
      e.message.includes("undefined") ||
      e.message.includes("Invalid") ||
      e.message.includes("falsch") ||
      e.message.includes("nicht gefunden") ||
      e.message.includes("undefiniert") ||
      e.message.includes("invalide") ||
      e.message.includes("passwort")
    ) {
      res.status(403).json({
        msg: "Die UserID oder das Passwort ist inkorrekt",
      });
    } else {
      res.status(500).json({
        msg: "There was a problem processing your request",
      });
    }
  }
});

module.exports = router;
