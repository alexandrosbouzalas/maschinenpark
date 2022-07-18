const mongoose = require("mongoose");

const statisticTimeSchema = new mongoose.Schema({
    statisticId: {
        type: String,
        required: true,
        unique: true,
    },
    bookingYear: {
        type: String,
        default: new Date().getFullYear(),
        required: true,
    },
    bookingMonth: {
        type: String,
        default: new Date().getMonth(),
        required: true,
    },
    allTimeBookings: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("StatisticTime", statisticTimeSchema);
