const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    lecturer: {
        type: String,
        required: true
    },
    student: {
        type: String,
        required: true
    },
    studentid: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("Booking", BookingSchema);
