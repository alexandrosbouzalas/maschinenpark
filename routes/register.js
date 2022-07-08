const express = require("express");
const router = express.Router();
const sanitize = require("mongo-sanitize");
const redis = require("redis");
const { bcryptHash } = require("../public/js/utils");
const { validatePassword } = require("../public/js/utils");
const { validateUserId } = require("../public/js/utils");

const User = require("./../models/user");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use("./public/js/utils", bcryptHash);
router.use("./public/js/utils", validatePassword);
router.use("./public/js/utils", validateUserId);

const redisPort = process.env.port || 6379;
const redisClient = redis.createClient(redisPort);

router.use(express.json());

router.get("/", (req, res) => {
  res.render("register/register");
/*  if (req.session.authenticated) {
    res.render("home/home", { title: title });
  } else {
    res.redirect("/");
  }*/
});

router.use(function (req, res, next) {
  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);
  next();
});

router.post("/", async (req, res) => {
  req.body = sanitize(req.body);

  const { lastname, firstname, userId, password, role, profession, apprenticeyear } = req.body.data;

  if (!validatePassword(password.toString()))
    throw new Error("Falsches Passwort");

  if (!validateUserId(userId.toString()))
    throw new Error("Falsche UserID");

  const user = new User({
    lastname: lastname,
    firstname: firstname,
    userId: userId.toUpperCase(),
    password: await bcryptHash(password),
    role: role,
    profession: profession,
    apprenticeyear: apprenticeyear,
  });

  try {
    await user.save();

    res.status(200).json({ msg: "Success" });
  } catch (e) {
    var status = res.status(500);
    if (e.message.includes("username"))
      status.json({
        msg: `Username "${username}" already exists`,
      });
    else if (e.message.includes("email"))
      status.json({
        msg: `Email "${email}" already exists`,
      });
    else {
      status.json({ msg: "There was a problem processing your request" });
    }
    console.log(e.message);
  }
});

module.exports = router;
