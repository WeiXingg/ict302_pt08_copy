import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        let existingUser;

        if (req.body.usertype === "student") {
            existingUser = await User.findOne({ $or: [{ email: req.body.email }, { studentid: req.body.studentid }] });
        } else {
            existingUser = await User.findOne({ email: req.body.email });
        }

        if (existingUser) {
            let errorMessage;
            if (req.body.usertype === "student") {
                errorMessage = "User with the same email or student ID already exists!";
            } else {
                errorMessage = "User with the same email already exists!";
            }
            return res.status(400).json({ error: errorMessage });
        }

        let newUser;

        if (req.body.usertype === "student") {
            // Create a new user document for students
            newUser = new User({
                usertype: req.body.usertype,
                username: req.body.username,
                email: req.body.email,
                studentid: req.body.studentid,
                password: hash,
            });
        } else {
            // Create a new user document for staffs
            newUser = new User({
                usertype: req.body.usertype,
                username: req.body.username,
                email: req.body.email,
                password: hash,
                booked: []
            });
        }
        await newUser.save();
        res.status(200).send("User has been created.");
    } catch (err) {
        return console.log("Error registering user.");
    }
}

export const login = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(404).json({ error: "User not found!" });

        const isPasswordCorrect = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!isPasswordCorrect)
            return res.status(400).json({ error: "Wrong password or username!" });

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT, { expiresIn: "15m" });

        const { password, ...otherDetails } = user._doc;
        res
            .status(200)
            .json({ ...otherDetails, isAdmin: user.isAdmin, access_token: token });
    } catch (err) {
        return console.log("Error logging in.");
    }
}
