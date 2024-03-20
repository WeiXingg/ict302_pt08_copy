const mongoose = require("mongoose");
const User = require("../models/User.js");

const updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (err) {
        console.error("Error updating user.");
        return res.status(500).json({ message: "Internal server error" });
    }
};

const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted.");
    } catch (err) {
        console.error("Error deleting user.");
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getUser = async (req, res) => {
    try {
        const identifier = req.params.identifier;
        let retrieveUser;
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            retrieveUser = await User.findById(identifier);
        } else {
            retrieveUser = await User.findOne({ username: identifier });
        }
        if (!retrieveUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(retrieveUser);
    } catch (err) {
        console.error("Error getting user.");
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getAllUser = async (req, res) => {
    try {
        const retrieveAllUser = await User.find();
        res.status(200).json(retrieveAllUser);
    } catch (err) {
        console.error("Error getting users.");
        return res.status(500).json({ message: "Internal server error" });
    }
};

const addBookedDate = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isBooked = user.booked.some(date => new Date(date).toISOString() === new Date(req.body.booked).toISOString());
        if (isBooked) {
            return res.status(400).json({ message: "Booked date already exists" });
        }
        user.booked.push(req.body.booked);
        await user.save();
        res.status(200).json(user);
    } catch (err) {
        console.error("Error adding booked date.");
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { updateUser, deleteUser, getUser, getAllUser, addBookedDate };
