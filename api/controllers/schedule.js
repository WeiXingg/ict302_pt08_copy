import User from "../models/User.js"
import Booking from "../models/Booking.js"

export const retrieveLecturers = async (req, res) => {
    try {
        const users = await User.find({ usertype: "staff" }, "username");
        // If no staff users are found, send an empty response
        if (!users || users.length === 0) {
            return res.status(200).json({ usernames: [] });
        }
        const usernames = users.map(user => user.username);
        return res.status(200).json({ usernames });
    } catch (err) {
        console.error("Error retrieving lecturers:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const retrieveBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ student: req.query.username });
        return res.status(200).json({ bookings });
    } catch (err) {
        console.error("Error retrieving bookings:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteBookedDate = async (req, res) => {
    try {
        const { username, date } = req.params;
        // Delete from user's booked dates
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const index = user.booked.findIndex(
            (bookedDate) => new Date(bookedDate).toISOString() === new Date(date).toISOString()
        );
        if (index === -1) {
            return res.status(400).json({ message: "Booked date not found" });
        }
        user.booked.splice(index, 1);
        await user.save();
        // Delete from booking table
        const booking = await Booking.findOneAndDelete({ lecturer: username, date });
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.status(200).json({ user, booking });
    } catch (err) {
        console.error("Error deleting booked date:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
