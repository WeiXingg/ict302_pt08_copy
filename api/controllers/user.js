import mongoose from "mongoose"
import User from "../models/User.js"

export const updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (err) {
        console.error("Error updating user:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted.");
    } catch (err) {
        console.error("Error deleting user:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getUser = async (req, res) => {
    try {
        const identifier = req.params.identifier;
        let retrieveUser;
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            // If the identifier is a valid MongoDB ObjectID, search by _id
            retrieveUser = await User.findById(identifier);
        } else {
            // Otherwise, search by username
            retrieveUser = await User.findOne({ username: identifier });
        }
        if (!retrieveUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(retrieveUser);
    } catch (err) {
        console.error("Error getting user:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllUser = async (req, res) => {
    try {
        const retrieveAllUser = await User.find();
        res.status(200).json(retrieveAllUser);
    } catch (err) {
        console.error("Error getting users:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const addBookedDate = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Check if the booked date already exists
        const isBooked = user.booked.some(date => new Date(date).toISOString() === new Date(req.body.booked).toISOString());
        if (isBooked) {
            return res.status(400).json({ message: "Booked date already exists" });
        }
        user.booked.push(req.body.booked);
        await user.save();
        res.status(200).json(user);
    } catch (err) {
        console.error("Error adding booked date:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
