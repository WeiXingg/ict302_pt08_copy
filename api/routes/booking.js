import express from "express"
import { createBooking, deleteBooking, getAllBooking, getBooking, updateBooking } from "../controllers/booking.js"
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js"

const router = express.Router();

//CREATE
router.post("/", verifyUser, createBooking);

//UPDATE
router.put("/:id", verifyUser, updateBooking);

//DELETE
router.delete("/:id", verifyUser, deleteBooking);

//GET
router.get("/:id", verifyUser, getBooking);

//GET ALL
router.get("/", verifyAdmin, getAllBooking);

export default router