const express = require("express");
const router = express.Router();
const User = require("./../models/user");
const Booking = require("./../models/booking");
const Machine = require("./../models/machine");
const Statistic = require("./../models/statistic");
const { response } = require("express");


router.use(express.json());

router.get("/", (req, res) => {
  if (req.session.authenticated) {
    res.render("home/home");
  } else {
    res.redirect("/");
  } 
});

router.post("/createNewBooking", async (req, res) => {
  if (req.session.authenticated) {
    try{

      const { userId } = req.session.user;
  
      const { maschineId, beginDate, endDate, activity, timewindow } = req.body.data;

      const bookingsCount = await Statistic.findOne({});
      
      const [beginDay, beginMonth, beginYear] = beginDate.split('.')
      const [endDay, endMonth, endYear] = endDate.split('.')
  
      const booking = new Booking({
        bookingId: parseInt(bookingsCount.allTimeBookings) + 1,
        userId: userId,
        machineId: maschineId,
        beginDate: new Date(beginYear, beginMonth, beginDay),
        endDate: new Date(endYear, endMonth, endDay),
        activity: activity,
        timewindow: timewindow
      });

      try {
        await booking.save();

        await Statistic.updateOne(
          { statisticId: "1" },
          { $set: { allTimeBookings: parseInt(bookingsCount.allTimeBookings) + 1 } }
        );

        res.status(200).send();
      } catch (e) {
        console.log(e.message);
      }

    } catch (e) {
      console.log(e.message);
      res.status(500).json({msg: "Beim Speichern Ihrer Buchung ist ein Fehler aufgetreten"});
    }
  } 
})

router.post("/deleteBooking", async (req, res) => {
  if(req.session.authenticated) {

    try {
      
        const bookingId = req.params.data
    
        await Booking.deleteOne(bookingId);
    
        res.status(200).send();
    
      } catch(e) {
        res.status(500).json({msg: "Beim Löschen Ihrer Buchung ist ein Fehler aufgetreten"});
      }
    } else {
      res.send(403).send();
    }

})

router.post("/getUserBookings", async (req, res) => {
  if (req.session.authenticated) {

    try {
      const { userId } = req.session.user;
    
      let userBookings = [];
      let currentBookingObj = {};
      
      const bookings = await Booking.find({userId: userId});
      
      for (let booking of bookings) {
        Object.assign(currentBookingObj, {bookingId: booking.bookingId});
        Object.assign(currentBookingObj, {userId: booking.creator});
        Object.assign(currentBookingObj, {machineId: booking.machineId});
        Object.assign(currentBookingObj, {beginDate: booking.beginDate});
        Object.assign(currentBookingObj, {endDate: booking.endDate});

        userBookings.push(currentBookingObj);
        currentBookingObj = {};
      }

      res.status(200).json(userBookings);
    } catch (err) {
      res.status(500).json({msg: "Beim Laden Ihrer Buchungen ist ein Fehler aufgetreten"});
    }
    
  } else {
    res.status(403).send();
  }
})

router.post("/updateBooking", async (req, res) => {
  if (req.session.authenticated) {

    try {
      const {bookingId, machines, beginDate, endDate} = req.body.data;

      const [beginDay, beginMonth, beginYear] = beginDate.split('.')
      const [endDay, endMonth, endYear] = endDate.split('.')

      const booking = await Booking.findOne({bookingId: bookingId});

      if(booking) {
        try {
          await Booking.updateMany(
            {
                bookingId: booking.bookingId,
            },
            { 
              $set: {
                machineId: machines[0],
                beginDate: new Date(beginYear, beginMonth, beginDay),
                endDate: new Date(endYear, endMonth, endDay),
              }           
            })

            res.status(200).send();
        } catch(err) {
          throw new Error();
        }
      } else {
        res.status(404).json({msg:"Diese Buchungsnummer existiert nicht"});
      }

    } catch (err) {
      res.status(500).json({msg: "Bei der Aktualisierung Ihrer Buchung ist ein Fehler aufgetreten"});
    }
    
  } else {
    res.status(403).send();
  }
})

module.exports = router;
