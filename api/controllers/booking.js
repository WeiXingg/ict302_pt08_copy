import Booking from "../models/Booking.js"

export const createBooking = async (req, res) => {
    const newBooking = new Booking(req.body);
    try {
        const savedBooking = await newBooking.save();
        res.status(200).json(savedBooking);
    } catch (err) {
        console.error("Error creating new booking:", err);
        return res.status(500).json({ message: "Internal server error" });
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
        console.error("Error updating booking:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteBooking = async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.status(200).json("Booking has been deleted.");
    } catch (err) {
        console.error("Error deleting booking:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getBooking = async (req, res) => {
    try {
        const retrievedBooking = await Booking.findById(req.params.id);
        res.status(200).json(retrievedBooking);
    } catch (err) {
        console.error("Error getting booking:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllBooking = async (req, res) => {
    try {
        const retrievedAllBooking = await Booking.find();
        res.status(200).json(retrievedAllBooking);
    } catch (err) {
        console.error("Error getting all bookings:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
