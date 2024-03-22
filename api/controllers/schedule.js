const User = require("../models/User.js");
const Booking = require("../models/Booking.js");

const retrieveLecturers = async (req, res) => {
    try {
        const users = await User.find({ usertype: "staff" }, "username email isAdmin");
        if (!users || users.length === 0) {
            return res.status(200).json({ usernames: [] });
        }
        const lecturers = users.map(user => ({
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin
        }));
        return res.status(200).json({ lecturers });
    } catch (err) {
        console.error("Error retrieving lecturers.", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const retrieveBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ $or: [{ studentid: req.query.studentid }, { lecturer: req.query.username }] });
        return res.status(200).json({ bookings });
    } catch (err) {
        console.error("Error retrieving bookings.", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteBookedDate = async (req, res) => {
    try {
        const { username, date } = req.params;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const index = user.booked.findIndex(bookedDate => new Date(bookedDate).toISOString() === new Date(date).toISOString());
        if (index === -1) {
            return res.status(400).json({ message: "Booked date not found" });
        }
        user.booked.splice(index, 1);
        await user.save();
        const booking = await Booking.findOneAndDelete({ lecturer: username, date });
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.status(200).json({ user, booking });
    } catch (err) {
        console.error("Error deleting booked date.", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { retrieveLecturers, retrieveBookings, deleteBookedDate };
