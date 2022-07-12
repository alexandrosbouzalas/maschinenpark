const express = require("express");
const router = express.Router();
const User = require("./../models/user");
const Booking = require("./../models/booking");
const Machine = require("./../models/machine");
const Statistic = require("./../models/statistic");
const { response } = require("express");
const { find } = require("./../models/user");


router.use(express.json());

router.get("/", (req, res) => {
  if (req.session.authenticated) {
    res.render("home/home");
  } else {
    res.redirect("/");
  } 
});

router.post("/getMachines", async (req, res) => {
  if (req.session.authenticated) {

    try {
      const machines = await Machine.find({});
      
      let machinesObj = [];
      let currentMachineObj = {};

      for (let machine of machines) {
        Object.assign(currentMachineObj, {machineId: machine.machineId});
        Object.assign(currentMachineObj, {status: machine.status});
        machinesObj.push(currentMachineObj);
        currentMachineObj = {};
      }

      res.status(200).json(machinesObj);
    } catch (err) {
      console.log(err)
      res.status(500).json({msg: "Beim Laden der Maschinen ist ein Fehler aufgetreten"});
    }
    
  } else {
    res.status(403).send();
  }
});

router.post("/createNewBooking", async (req, res) => {
  if (req.session.authenticated) {
    try{

      const { userId } = req.session.user;
  
      const { machineId, beginDate, endDate, activity, timewindow } = req.body.data;

      const bookingsCount = await Statistic.findOne({});
      
      const [beginDay, beginMonth, beginYear] = beginDate.split('.')
      const [endDay, endMonth, endYear] = endDate.split('.')
  
      const booking = new Booking({
        bookingId: parseInt(bookingsCount.allTimeBookings) + 1,
        userId: userId,
        machineId: machineId,
        beginDate: new Date(beginYear, beginMonth, beginDay),
        endDate: new Date(endYear, endMonth, endDay),
        activity: activity,
        timewindow: timewindow
      });

      try {

        await booking.save();

        await Machine.updateOne(
          { machineId: booking.machineId},
          { $set: {status: 'O'}}
        ); 
        
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
      
        const bookingId = req.body.data

        const userId = req.session.user.userId;

        const user = await User.findOne({userId: userId});


        if(user) {
          const userBookings = await Booking.find({userId: userId});

          const userBookingsId = [];

          for(let booking of userBookings){
             userBookingsId.push(booking.bookingId);
          }

          if(userBookingsId.includes(bookingId)) {

            const booking = await Booking.findOne({bookingId: bookingId});

            await Booking.deleteOne({bookingId: bookingId})
    
            await Machine.updateOne(
              { machineId: booking.machineId},
              { $set: {status: 'F'}}
            );
        
            res.status(200).send();

          } else {
            throw new Error();
          }

        }
    
      } catch(e) {
        res.status(500).json({msg: "Beim Löschen Ihrer Buchung ist ein Fehler aufgetreten"});
      }
    
  } else {
    res.status(403).send();
  }

})

router.post("/getUserBookings", async (req, res) => {
  if (req.session.authenticated) {

    try {
      const { userId } = req.session.user;

      const getAllBookings = req.body.data;

      let bookings;

      if(getAllBookings) {

        const user = await User.findOne({userId: userId});

        if(user.permissionClass !== "3") {
          console.log("Insufficient permissions")
          throw new Error("Insufficient permissions")
        } 

        bookings = await Booking.find({});
        
      } else {
        
        bookings = await Booking.find({userId: userId});

      }
      

      let userBookings = [];
      let currentBookingObj = {};
          
      for (let booking of bookings) {
        Object.assign(currentBookingObj, {bookingId: booking.bookingId});
        Object.assign(currentBookingObj, {userId: booking.userId});
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

            await Machine.updateOne(
              { machineId: booking.machineId},
              { $set: {status: 'F'}}
            );

            await Machine.updateOne(
              { machineId: machines[0]},
              { $set: {status: 'O'}}
            );

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

router.post("/getUserPermissions", async (req, res) => {
  if (req.session.authenticated) {
    try {

      const { userId } = req.session.user;
      const permissionClass = req.body.data;
      
      const user = await User.findOne({userId: userId});

      if(user) {

        if(user.permissionClass === permissionClass.toString()) 
          res.status(200).send();
        else 
          res.status(403).send();
      }
        
    } catch (err) {
      res.status(403).send();
    }
    
  } else {
    res.status(403).send();
  }
})


module.exports = router;
