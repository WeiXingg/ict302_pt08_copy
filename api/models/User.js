import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema({
    usertype: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    studentid: {
        type: Number,
        unique: true,
        required: function () {
            return this.usertype === "student";
        }
    },
    booked: {
        type: [Date],
        required: function () {
            return this.usertype === "staff";
        }
    }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);