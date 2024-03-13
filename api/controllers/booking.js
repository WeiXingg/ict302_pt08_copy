import Booking from "../models/Booking.js"

export const createBooking = async (req, res) => {
    const newBooking = new Booking(req.body);
    try {
        const savedBooking = await newBooking.save();
        res.status(200).json(savedBooking);
    } catch (err) {
        return console.log("Error creating new booking.");
    }
}

export const updateBooking = async (req, res) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedBooking);
    } catch (err) {
        return console.log("Error updating booking.");
    }
}

export const deleteBooking = async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.status(200).json("Booking has been deleted.");
    } catch (err) {
        return console.log("Error deleting booking.");
    }
}

export const getBooking = async (req, res) => {
    try {
        const retrievedBooking = await Booking.findById(req.params.id);
        res.status(200).json(retrievedBooking);
    } catch (err) {
        return console.log("Error getting booking.");
    }
}

export const getAllBooking = async (req, res) => {
    try {
        const retrievedAllBooking = await Booking.find();
        res.status(200).json(retrievedAllBooking);
    } catch (err) {
        return console.log("Error getting all bookings.");
    }
}
