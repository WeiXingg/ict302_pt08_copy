const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
    usertype: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        index: {
            unique: true,
            collation: { locale: "en", strength: 2 }
        }
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
    isStaff: {
        type: Boolean,
        default: false
    },
    staffid: {
        type: Number,
        unique: true,
        required: function () {
            return this.usertype === "staff";
        }
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

module.exports = mongoose.model("User", UserSchema);
