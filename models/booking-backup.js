const mongoose = require("mongoose");

const bookingBackupSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true,
  },
  machineId: {
    type: String,
    required: true,
    unique: true
  },
  beginDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  activity: {
    type: String,
    required: true,
  },
  timewindow: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now(),
  }
});

module.exports = mongoose.model("BookingBackup", bookingBackupSchema);
