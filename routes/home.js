const express = require("express");
const router = express.Router();

router.use(express.json());

router.get("/", (req, res) => {
  //res.render("home/home");

  if (req.session.authenticated) {
    res.render("home/home", { title: title });
  } else {
    res.redirect("/");
  } 
});

/* router.post("/", (req, res) => {
  try {
    redisClient.get("tsdata", (err, response) => {
      if (err) throw new Error(err);
      else if (response) {
        const data = JSON.parse(response);

        res
          .status(200)
          .json({ clients: data.clients, channels: data.channels });
      } else {
        console.log("No data received");
        res
          .status(500)
          .json({ msg: "There was an error processing your request" });
      }
    });
  } catch (e) {
    console.log(e.message);
  }
}); */

module.exports = router;
