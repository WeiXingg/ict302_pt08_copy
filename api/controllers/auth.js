const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        
        let existingUser;

        existingUser = await User.findOne({ username: { $regex: new RegExp("^" + req.body.username + "$", "i") } });
        if (existingUser) {
            return res.status(400).json({ error: "User with the same username already exists!" });
        }

        existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ error: "User with the same email already exists!" });
        }

        if (req.body.usertype === "student") {
            existingUser = await User.findOne({ studentid: req.body.studentid });
            if (existingUser) {
                return res.status(400).json({ error: "User with the same student ID already exists!" });
            }
        } else if (req.body.usertype === "staff") {
            existingUser = await User.findOne({ staffid: req.body.staffid });
            if (existingUser) {
                return res.status(400).json({ error: "User with the same staff ID already exists!" });
            }
        }

        let newUser;

        if (req.body.usertype === "student") {
            newUser = new User({
                usertype: req.body.usertype,
                username: req.body.username,
                email: req.body.email,
                studentid: req.body.studentid,
                password: hash,
            });
        } else if (req.body.usertype === "staff") {
            newUser = new User({
                usertype: req.body.usertype,
                username: req.body.username,
                email: req.body.email,
                staffid: req.body.staffid,
                password: hash,
                booked: [],
                isStaff: true
            });
        } else {
            return;
        }
        await newUser.save();
        res.status(200).send("User has been created.");
    } catch (err) {
        console.error("Error registering user.", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const login = async (req, res) => {
    try {
        // const user = await User.findOne({ username: req.body.username });
        const user = await User.findOne({ username: { $regex: new RegExp("^" + req.body.username + "$", "i") } });
        if (!user) return res.status(404).json({ error: "User not found!" });

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ error: "Wrong password or username!" });

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT, { expiresIn: "15m" });

        const { password, ...otherDetails } = user._doc;
        res.status(200).json({ ...otherDetails, isAdmin: user.isAdmin, access_token: token });
    } catch (err) {
        console.error("Error logging in.", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { register, login };
