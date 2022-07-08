const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profession:{
    type: String, 
    required: true,
  },
  apprenticeyear: {
    type: String, 
    required: true,
  },
  instructed: {
    type: Boolean, 
    required: false,
  },
  registeredAt: {
    type: Date,
    default: Date.now(),
  }
});

module.exports = mongoose.model("User", userSchema);
