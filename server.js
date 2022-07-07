const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const redis = require("redis");
const redisStore = require("connect-redis")(session);
const redisClient = redis.createClient();

const homeRouter = require("./routes/home");
const registerRouter = require("./routes/register");
const loginRouter = require("./routes/login");
/* const logoutRouter = require("./routes/logout"); */

const port = 3000;

const title = "index";

const app = express();

mongoose.connect("mongodb://localhost:27017/maschinenpark");

redisClient.on("error", (err) => {
  console.log("\nCould not establish a connection with redis.\n".toUpperCase());
  throw err;
});

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/img", express.static(__dirname + "public/img"));

app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "Fkdj^45ci@Jad", // This is not a password
    cookie: {
      maxAge: 604800000,
    },
    store: new redisStore({
      host: "localhost",
      port: 6379,
      client: redisClient,
      ttl: 260,
    }),
    secure: false, // if true only transmit cookie over https
    httpOnly: false, // if true prevent client side JS
    resave: false,

    saveUninitialized: false,
  })
);

app.get("/", (req, res) => {
    res.render("index/index");
 /*  if (req.session.authenticated) res.redirect("/home");
  else res.render("index/index", { title: title }); */
});

app.use("/home", homeRouter);
app.use("/register", registerRouter);
app.use("/login", loginRouter);
/*app.use("/logout", logoutRouter);
app.use("/recover", recoverRouter); */

try {

  const server = app.listen(3000)
  
  console.info(`Listening on: http://localhost:3000`);

} catch (e) {
  
  console.log("There was an error starting the app");
  console.log(e.message);
}

