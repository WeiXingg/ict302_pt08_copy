const express = require("express");
const { createBooking, deleteBooking, getAllBooking, getBooking, updateBooking } = require("../controllers/booking.js");
const { verifyAdmin, verifyUser } = require("../utils/verifyToken.js");

const router = express.Router();

// CREATE
router.post("/", verifyUser, createBooking);

// UPDATE
router.put("/:id", verifyUser, updateBooking);

// DELETE
router.delete("/:id", verifyUser, deleteBooking);

// GET
router.get("/:id", verifyUser, getBooking);

// GET ALL
router.get("/", verifyAdmin, getAllBooking);

module.exports = router;
