import mongoose from "mongoose"

const BookingSchema = new mongoose.Schema({
    lecturer: {
        type: String,
        required: true
    },
    student: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
});

export default mongoose.model("Booking", BookingSchema)