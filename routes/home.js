const express = require("express");
const router = express.Router();
const User = require("./../models/user");
const Booking = require("./../models/booking");
const BookingBackup = require("./../models/booking-backup");
const Machine = require("./../models/machine");
const StatisticProfession = require("./../models/statistic-profession");
const StatisticRole = require("./../models/statistic-role");
const StatisticTime = require("./../models/statistic-time");
const { bcryptHash } = require("../public/js/utils");
const machine = require("./../models/machine");
const { db } = require("./../models/user");

const apiKey = "jfa9lkm30eKJ2SdlKS";


router.use(express.json());

router.get("/", (req, res) => {
  if (req.session.authenticated) {
    res.render("home/home");
  } else {
    res.redirect("/");
  } 
});

router.post("/getUserInfo", async (req, res) => {
  if (req.session.authenticated) {
    try {
      const { userId } = req.session.user;
      const user = await User.findOne({userId: userId});
      
      if(user) {
        let userInfo = [];
  
        userInfo.push(user.lastname);
        userInfo.push(user.firstname);

        res.status(200).send(userInfo);

      } else {
        res.status(400).send("No user found");
      }

    } catch (err) {
      console.log(err)
      res.status(500).json({msg: "Beim Laden der Maschinen ist ein Fehler aufgetreten"});
    }
    
  } else {
    res.status(403).send();
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

      res.status(200).json(machinesObj.sort((a, b) => (parseInt(a.machineId.substring(1).trim()) > parseInt(b.machineId.substring(1).trim())) ? 1 : -1));
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

        const bookingYear = new Date().getFullYear();
        const bookingMonth = new Date().getMonth();

        const [beginDay, beginMonth, beginYear] = beginDate.split('.')
        const [endDay, endMonth, endYear] = endDate.split('.')

        const bookingsProfession = await StatisticProfession.find({statisticProfession: user.profession});
        const bookingsRole = await StatisticRole.find({statisticRole: user.role});

        const bookingsProfessionAll = await StatisticProfession.findOne({statisticId: "1"});
        const bookingsRoleAll = await StatisticRole.findOne({statisticId: "1"});
        
        const bookingId = parseInt(bookingsProfessionAll.allTimeBookings) + 1;

        const statisticTime = await StatisticTime.findOne({bookingYear: bookingYear, bookingMonth: bookingMonth + 1})


        /* Depending on the timewindow that the user selected when creating the booking, the 
        booking object endDate is constructed accordingly  */

        let hoursToAdd;

        switch(timewindow) {
          case "FULL":
            hoursToAdd = 23;
            break;
          case "BEFORE":
            hoursToAdd = 11;
            break;
          case "AFTER":
            hoursToAdd = 15;
            break;
          default:
            hoursToAdd = 23; 
            break;
        }
    
        const booking = new Booking({
          bookingId: bookingId,
          userId: userId,
          machineId: machineId,
          beginDate: new Date(`${beginYear}-${beginMonth}-${beginDay}`),
          endDate: new Date(`${endYear}-${endMonth}-${endDay}`).setHours(hoursToAdd, 59, 59, 0),
          activity: activity,
          timewindow: timewindow
        });
        
        const bookingBackup = new BookingBackup({
          bookingId: bookingId,
          userId: userId,
          machineId: machineId,
          beginDate: new Date(`${beginYear}-${beginMonth}-${beginDay}`),
          endDate: new Date(`${endYear}-${endMonth}-${endDay}`).setHours(hoursToAdd, 59, 59, 0),
          activity: activity,
          timewindow: timewindow
        });

        try {
  
          await booking.save();
          await bookingBackup.save();

          if(statisticTime) {
            await StatisticTime.updateOne(
              { bookingYear: bookingYear, bookingMonth: bookingMonth + 1 },
              { $set: { allTimeBookings: parseInt(statisticTime.allTimeBookings) + 1 }}
            );
          }

          await Machine.updateOne(
            { machineId: booking.machineId},
            { $set: {status: 'O'}}
          ); 
          
          if(user.profession !== "AUSB" && user.profession !== "ABBA") {
            await StatisticProfession.updateOne(
              { statisticProfession: user.profession},
              { $set: { allTimeBookings: parseInt(bookingsProfession[0].allTimeBookings) + 1 } }
            );
          }

          await StatisticProfession.updateOne(
            { statisticId: "1"},
            { $set: { allTimeBookings: parseInt(bookingsProfessionAll.allTimeBookings) + 1 } }
            );
            
          await StatisticRole.updateOne(
            { statisticRole: user.role},
            { $set: { allTimeBookings: parseInt(bookingsRole[0].allTimeBookings) + 1 } }
          );

          await StatisticRole.updateOne(
            { statisticId: "1"},
            { $set: { allTimeBookings: parseInt(bookingsRoleAll.allTimeBookings) + 1 } }
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

          if(user.permissionClass ==="2") {

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

router.post("/deleteBookingsApi", async (req, res) => {
  if(req.body.apiKey === apiKey) {
    try {

      const bookingsToDelete = req.body.bookingsToDelete;
  
      for(let booking of bookingsToDelete) {
        
        const bookingToDelete = await Booking.findOne({bookingId: booking.bookingId});

        if(bookingToDelete) {
          await Booking.deleteOne({bookingId: bookingToDelete.bookingId})
  
          await Machine.updateOne(
            { machineId: bookingToDelete.machineId},
            { $set: {status: 'F'}}
            );

        } else {
          throw new Error("Booking does not exist");
        }
      }

      res.status(200).send("Booking(s) deleted successfully");

    } catch(err) {
      console.log(err);
      res.status(400).send("Wrong data supplied")
    }
  } else {
    res.status(403).send("ACCESS DENIED");
  }
})

router.post("/getUserBookings", async (req, res) => {
  if (req.session.authenticated || req.body.apiKey === apiKey) {
    try {
      if(req.body.apiKey === apiKey) {
        const bookings = await Booking.find({});
        res.status(200).json(bookings);
      } else {

        const { userId } = req.session.user;
        const getAllBookings = req.body.data;
        const dbToUse = req.body.db;
                
        let bookings;
  
        if(getAllBookings) {
        
          const user = await User.findOne({userId: userId});
  
          if(user.permissionClass !=="2") {
            console.log("Insufficient permissions")
            throw new Error("Insufficient permissions")
          } 
          
          if(dbToUse === 'CURRENT') {
            bookings = await Booking.find({});
          } else if(dbToUse === "BACKUP") {
            bookings = await BookingBackup.find({});
          }
          
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
      }
    } catch (err) {
      res.status(500).json({msg: "Beim Laden Ihrer Buchungen ist ein Fehler aufgetreten"});
    }
    
  } else {
    res.status(403).send("ACCESS DENIED");
  }
})

router.post("/getTextStats", async (req, res) => {
  if (req.session.authenticated) {
    try {
      let statisticData = await StatisticProfession.find();
      let userCount = await User.aggregate([{ $count: "userId" }]);
      let machines = await Machine.find();
      let fräsCount = 0;
      let drehCount = 0;
      let bohrCount = 0;
      
      let currentProfessionStatisticsObj = {};
      let dataArr = [];

      for (let stat of statisticData) {
        if (stat.statisticProfession == "ALL") {
          Object.assign(currentProfessionStatisticsObj, {allTimeBookings: stat.allTimeBookings});

          dataArr.push(currentProfessionStatisticsObj);
          currentProfessionStatisticsObj = {};
        }
      }

      dataArr.push(userCount[0].userId)

      for (let machine of machines) {
        switch (machine.machineId.substring(0, 1)) {
          case "F":
            fräsCount += 1;
            break;
          case "D":
            drehCount += 1;
            break;
          case "B":
            bohrCount += 1;
            break;
          default: 
            break;
        }
      }

      dataArr.push(fräsCount);
      dataArr.push(drehCount);
      dataArr.push(bohrCount);

      res.status(200).json(dataArr);
    } catch (err) {
      res.status(500).json({msg: "Beim Laden der Daten ist ein Fehler aufgetreten"});
    }
  } else {
    res.status(403).send();
  }
})

router.post("/getStatisticData", async (req, res) => {
  if (req.session.authenticated) {

    try {
      const { searchData, searchYear } = req.body;

      let dataObj = {};
      let statisticsLabel = [];
      let statisticsNumbers = [];
      let currentNumberStatisticsObj = {};
      let statisticData = {};

      switch (searchData) {
        case "profession":
          let currentProfessionStatisticsObj = {};  
          statisticData = await StatisticProfession.find();

          for (let statistic of statisticData) {
            Object.assign(currentProfessionStatisticsObj, {statisticLabel: statistic.statisticProfession});
            Object.assign(currentNumberStatisticsObj, {allTimeBookings: statistic.allTimeBookings});

            statisticsLabel.push(currentProfessionStatisticsObj);
            statisticsNumbers.push(currentNumberStatisticsObj);

            currentProfessionStatisticsObj = {};
            currentNumberStatisticsObj = {};
          }

          dataObj = {statisticsLabel, statisticsNumbers};
          break;
        case "role":
          let currentRoleStatisticsObj = {};  
          statisticData = await StatisticRole.find();

          for (let statistic of statisticData) {
            Object.assign(currentRoleStatisticsObj, {statisticLabel: statistic.statisticRole});
            Object.assign(currentNumberStatisticsObj, {allTimeBookings: statistic.allTimeBookings});

            statisticsLabel.push(currentRoleStatisticsObj);
            statisticsNumbers.push(currentNumberStatisticsObj);

            currentRoleStatisticsObj = {};
            currentNumberStatisticsObj = {};
          }

          dataObj = {statisticsLabel, statisticsNumbers};
          break;
        case "time": 
          let currentMonthStatisticsObj = {};
          statisticData = await StatisticTime.find();

          for (let statistic of statisticData) {
            if(parseInt(statistic.bookingYear) == searchYear){
              Object.assign(currentMonthStatisticsObj, {statisticLabel: statistic.bookingMonth});
              Object.assign(currentNumberStatisticsObj, {allTimeBookings: statistic.allTimeBookings});

              statisticsLabel.push(currentMonthStatisticsObj);
              statisticsNumbers.push(currentNumberStatisticsObj);

              currentMonthStatisticsObj = {};
              currentNumberStatisticsObj = {};
            }
          }
          
          dataObj = {statisticsLabel, statisticsNumbers};
          break;
        default:
          break;
      }

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
          if(user.permissionClass ==="2") {
            
            let usersArr = [];
            let currentUser = {};
  
            for(let user of users) {
              if(user.userId !== userId) {
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
            if(user.permissionClass ==="2") {
              
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
          if(user.permissionClass ==="2") {

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

          if(user.permissionClass ==="2") {
            
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

router.post("/addMachine", async (req, res) => {
  if (req.session.authenticated) {
    try {
      const { userId } = req.session.user;

      const { machineId } = req.body.data;

      const user = await User.findOne({userId: userId});

      if(user) {
        if(user.permissionClass ==="2") {

          const machine = await Machine.findOne({machineId: machineId});

          if(!machine) {
            
            const machine = new Machine({
              machineId: machineId,
              status: 'F'
            });
      
            try {
      
              await machine.save();

            } catch(e) {
              console.log(e);
              res.status(500).send();
            }

            res.status(200).send();
          } else {
            res.status(400).send("Maschine existiert bereits");
          }
        }
      } 
    } catch (err) {
      res.status(403).json({msg: "Beim Löschen der Buchung ist ein unerwarteter Fehler augetreten"});
    }
    
  } else {
    res.status(403).send();
  }
})

router.post("/updateMachine", async (req, res) => {
  if (req.session.authenticated) {
    try {
      const { userId } = req.session.user;

      const { machineId, status } = req.body.data;

      const user = await User.findOne({userId: userId});

      if(user) {
        if(user.permissionClass ==="2") {

          const machine = await Machine.findOne({machineId: machineId});

          if(machine && machine.status !== status) {
            await Machine.updateOne({machineId: machineId}, {$set: {status: status}});

            res.status(200).send();
          } else {
            throw new Error("Diese Maschine existiert nicht")
          }
        }
      } 
    } catch (err) {
      res.status(403).json({msg: "Beim Aktualisieren der Maschine ist ein unerwarteter Fehler augetreten"});
    }
    
  } else {
    res.status(403).send();
  }
})

router.post("/deleteMachine", async (req, res) => {
  if (req.session.authenticated) {
    try {
      const { userId } = req.session.user;

      const { machineId } = req.body.data;

      const user = await User.findOne({userId: userId});

      if(user) {
        if(user.permissionClass ==="2") {

          const machine = await Machine.findOne({machineId: machineId});

          if(machine) {
            await Machine.deleteOne({machineId: machineId});

            res.status(200).send();
          }
        }
      } 
    } catch (err) {
      res.status(403).json({msg: "Beim Löschen der Buchung ist ein unerwarteter Fehler augetreten"});
    }
    
  } else {
    res.status(403).send();
  }
})

module.exports = router;
