const express = require("express");
const router = express.Router();
const User = require("./../models/user");
const Booking = require("./../models/booking");
const Machine = require("./../models/machine");
const Statistic = require("./../models/statistic");
const statistic = require("./../models/statistic");
const { bcryptHash } = require("../public/js/utils");


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
      const bookings = await Booking.find({});
      const users = await User.find({});
      
      let machinesObj = [];
      let currentMachineObj = {};

      for (let machine of machines) {
        Object.assign(currentMachineObj, {machineId: machine.machineId});
        Object.assign(currentMachineObj, {status: machine.status});


        if(machine.status === "O") {

          for(let booking of bookings) {

            if(booking.machineId === machine.machineId) {

              for(let user of users) {

                if(user.userId === booking.userId) {
                  Object.assign(currentMachineObj, {firstname: user.firstname});
                  Object.assign(currentMachineObj, {lastname: user.lastname});
                  Object.assign(currentMachineObj, {endDate: booking.endDate});
                  Object.assign(currentMachineObj, {timewindow: booking.timewindow});
                }
              }
            }
          }
        }

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

      const user = await User.findOne({userId: userId});

      if(user) {

        const [beginDay, beginMonth, beginYear] = beginDate.split('.')
        const [endDay, endMonth, endYear] = endDate.split('.')

        const bookingsProfession = await Statistic.find({statisticProfession: user.profession});

        const bookingsAll = await Statistic.findOne({statisticId: "1"});
    
        const booking = new Booking({
          bookingId: parseInt(bookingsAll.allTimeBookings) + 1,
          userId: userId,
          machineId: machineId,
          beginDate: new Date(`${beginYear}-${beginMonth}-${beginDay}`),
          endDate: new Date(`${endYear}-${endMonth}-${endDay}`),
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
            { statisticProfession: user.profession},
            { $set: { allTimeBookings: parseInt(bookingsProfession[0].allTimeBookings) + 1 } }
          );

          await Statistic.updateOne(
            { statisticId: "1"},
            { $set: { allTimeBookings: parseInt(bookingsAll.allTimeBookings) + 1 } }
          );
  
          res.status(200).send();
        } catch (e) {
          console.log(e.message);
        }
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

          if(user.permissionClass === "3") {

            try{

              const booking = await Booking.findOne({bookingId: bookingId});
  
              await Booking.deleteOne({bookingId: bookingId})
      
              await Machine.updateOne(
                { machineId: booking.machineId},
                { $set: {status: 'F'}}
              );
          
              res.status(200).send();
            } catch(e) {
              console.log(e.message);
              throw new Error();
            }

          } else {

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

router.post("/getStatisticsData", async (req, res) => {
  if (req.session.authenticated) {

    try {
      const statisticData = await statistic.find();

      let dataObj = {};
      let statisticsNumbers = [];
      let statisticsProfessions = [];
      let currentProfessionStatisticsObj = {};
      let currentNumberStatisticsObj = {};
          
      for (let statistic of statisticData) {
        Object.assign(currentProfessionStatisticsObj, {statisticProfession: statistic.statisticProfession});
        Object.assign(currentNumberStatisticsObj, {allTimeBookings: statistic.allTimeBookings});

        statisticsProfessions.push(currentProfessionStatisticsObj);
        statisticsNumbers.push(currentNumberStatisticsObj);

        currentProfessionStatisticsObj = {};
        currentNumberStatisticsObj = {};
      }
      
      dataObj = {statisticsProfessions, statisticsNumbers};
      res.status(200).json(dataObj);
    } catch (err) {
      res.status(500).json({msg: "Beim Laden der Daten ist ein Fehler aufgetreten"});
    }
    
  } else {
    res.status(403).send();
  }
})

router.post("/updateBooking", async (req, res) => {
  if (req.session.authenticated) {

    try {
      const updateOptions = {};

      const {bookingId, machines, beginDate, endDate} = req.body.data;

      if(beginDate) {
        const [beginDay, beginMonth, beginYear] = beginDate.split('.');
        Object.assign(updateOptions, {beginDate: new Date(`${beginYear}-${beginMonth}-${beginDay}`)});
      }
      if(endDate) {
        const [endDay, endMonth, endYear] = endDate.split('.')
        Object.assign(updateOptions, {endDate: new Date(`${endYear}-${endMonth}-${endDay}`)});
      }
      if(machines) {
        Object.assign(updateOptions, {machineId: machines});
      }
      
      const booking = await Booking.findOne({bookingId: bookingId});

      if(booking) {
        try {

          await Booking.updateMany(
            {
                bookingId: booking.bookingId,
            },
            { 
              $set: updateOptions         
            })

            await Machine.updateOne(
              { machineId: booking.machineId},
              { $set: {status: 'F'}}
            );

            await Machine.updateOne(
              { machineId: machines},
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

router.post("/getAllUsers", async (req, res) => {
  if (req.session.authenticated) {
    try {
      const { userId } = req.session.user;

      const user = await User.findOne({userId: userId});
      const users = await User.find({});

      if(user) {

        if(users.length >= 1) {
          if(user.permissionClass === "3") {
            
            let usersArr = [];
            let currentUser = {};
  
            for(let user of users) {
              Object.assign(currentUser, {firstname: user.firstname});
              Object.assign(currentUser, {lastname: user.lastname});
              Object.assign(currentUser, {userId: user.userId});
              Object.assign(currentUser, {role: user.role});
              Object.assign(currentUser, {profession: user.profession});
              Object.assign(currentUser, {apprenticeyear: user.apprenticeyear});
              Object.assign(currentUser, {permissionClass: user.permissionClass});
              
  
              usersArr.push(currentUser);
              currentUser = {};
            }
  
            res.status(200).send(usersArr);
          } else 
            res.status(403).send();
        } else {
          throw new Error("Keine Nutzer gefunden");
        }

      }
        
    } catch (err) {
      res.status(403).send();
    }
    
  } else {
    res.status(403).send();
  }
})

router.post("/updateUser", async (req, res) => {
  if (req.session.authenticated) {
    try {

      const { userId } = req.session.user;
      const updateOptions = req.body.data;

      const userIdToEdit = updateOptions.userIdToEdit;

      delete updateOptions.userIdToEdit;

      const user = await User.findOne({userId: userId});
      const userToEdit = await User.findOne({userId: userIdToEdit});

      const userIdPrevious = await User.findOne({userId: updateOptions.userId})

      if(userIdPrevious) {
        throw new Error('Die eingegebene UserID existiert bereits und kann nicht nochmal benutzt werden')
      } else {
        if(user && userToEdit) {
            if(user.permissionClass === "3") {
              
              await User.updateMany(
                {
                    userId: userIdToEdit,
                },
                { 
                  $set: updateOptions     
                })
  
              res.status(200).send();
            } else 
              res.status(403).json({msg: "Beim Bearbeiten der Nutzerdaten ist ein Problem aufgetreten"});
        } else {
          res.status(400).json({msg: "Beim Bearbeiten der Nutzerdaten ist ein Problem aufgetreten"});
        }
      }
       
    } catch (err) {
      res.status(400).json({msg: err.message});
    }
  } else {
    res.status(403).send();
  }
})

router.post("/updateUserPassword", async (req, res) => {
  if (req.session.authenticated) {
    try {

      const { userId } = req.session.user;

      const updateOptions = req.body.data;

      const userIdToEdit = updateOptions.userIdToEdit;
      const newPassword = updateOptions.password;
      
      delete updateOptions.userIdToEdit;

      const user = await User.findOne({userId: userId});
      const userToEdit = await User.findOne({userId: userIdToEdit});


      if(user && userToEdit) {
          if(user.permissionClass === "3") {

            updateOptions.password = await bcryptHash(newPassword),
            
            await User.updateMany(
              {
                  userId: userIdToEdit,
              },
              { 
                $set: updateOptions     
              })

            res.status(200).send();
          } else 
            res.status(403).json({msg: "Beim Bearbeiten der Nutzerdaten ist ein Problem aufgetreten"});
      } else {
        res.status(400).json({msg: "Beim Bearbeiten der Nutzerdaten ist ein Problem aufgetreten"});
      }
       
    } catch (err) {
      res.status(400).json({msg: err.message});
    }
  } else {
    res.status(403).send();
  }
})

router.post("/deleteUser", async (req, res) => {
  if (req.session.authenticated) {
    try {

      const { userId } = req.session.user;
      const  userIdToDelete = req.body.data;

      const user = await User.findOne({userId: userId});
      const userToDelete = await User.findOne({userId: userIdToDelete})

      if(user) {

        if(userToDelete) {

          if(user.permissionClass === "3") {
            
            await User.deleteOne({userId: userIdToDelete});

            res.status(200).send();
          } else 
            res.status(403).send();
        } else {
          throw new Error("Keine Nutzer gefunden");
        }

      } else {
        res.status(403).send();
      }
        
    } catch (err) {
      throw new Error("Beim Löschen des Nutzers ist ein Problem aufgetreten");
    }
    
  } else {
    res.status(403).send();
  }
})


module.exports = router;
