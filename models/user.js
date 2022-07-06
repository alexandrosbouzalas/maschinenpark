const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  vorname: {
    type: String,
    required: true,
  },
  uId: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
  },
  passwort: {
    type: String,
    required: true,
  },
  lehrjahr: {
    type: String, 
    required: true,
  },
  registeredAt: {
    type: Date,
    default: Date.now(),
  }
});

module.exports = mongoose.model("User", userSchema);
