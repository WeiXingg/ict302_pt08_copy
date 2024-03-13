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
        return console.log("Error retrieving lecturers.");
    }
}

export const retrieveBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ student: req.query.username });
        return res.status(200).json({ bookings });
    } catch (err) {
        return console.log("Error retrieving bookings.");
    }
}
