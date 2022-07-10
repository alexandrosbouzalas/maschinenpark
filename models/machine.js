const mongoose = require("mongoose");

const machineSchema = new mongoose.Schema({
  machineId: {
    type: String,
    required: true,
  },
  machineType: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  registeredAt: {
    type: Date,
    default: Date.now(),
  }
});

module.exports = mongoose.model("Machine", machineSchema);
