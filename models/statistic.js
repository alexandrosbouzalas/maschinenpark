const mongoose = require("mongoose");

const statisticSchema = new mongoose.Schema({
    statisticId: {
        type: String,
        required: true,
    },
    statisticProfession: {
        type: String,
        required: true,
    },
    allTimeBookings: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("Statistic", statisticSchema);
