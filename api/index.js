import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoute from "./routes/auth.js"
import usersRoute from "./routes/users.js"
import bookingRoute from "./routes/booking.js"
import scheduleRoute from "./routes/schedule.js"
import cors from "cors";

const app = express();

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
app.use(cors())
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/booking", bookingRoute);
app.use("/api/schedule", scheduleRoute);

app.listen(8800, () => {
    connect();
});