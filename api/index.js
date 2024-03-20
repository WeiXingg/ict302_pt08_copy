const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth.js");
const usersRoute = require("./routes/users.js");
const bookingRoute = require("./routes/booking.js");
const scheduleRoute = require("./routes/schedule.js");
const cors = require("cors");

const app = express();
const port = 8800;

dotenv.config();

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to MongoDB.");
    } catch (error) {
        throw error;
    }
};

//middlewares
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/booking", bookingRoute);
app.use("/api/schedule", scheduleRoute);

connect().then(() => {
    app.listen(port, () => {
        console.log("listening for requests");
    })
});

module.exports = app;