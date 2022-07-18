const mongoose = require("mongoose");

const statisticRoleSchema = new mongoose.Schema({
    statisticId: {
        type: String,
        required: true,
    },
    statisticRole: {
        type: String,
        required: true,
    },
    allTimeBookings: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("StatisticRole", statisticRoleSchema);
