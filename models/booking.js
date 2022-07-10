const mongoose = require("mongoose");

const machineSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  creator: {
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
  creationDate: {
    type: Date,
    default: Date.now(),
  }
});

module.exports = mongoose.model("Machine", machineSchema);
