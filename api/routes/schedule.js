import express from "express"
import { retrieveLecturers, retrieveBookings, deleteBookedDate } from "../controllers/schedule.js"
import { verifyUser } from "../utils/verifyToken.js"

const router = express.Router();

router.get("/retrievelecturers", verifyUser, retrieveLecturers);
router.get("/retrievebookings", verifyUser, retrieveBookings);
router.delete("/:username/:date", verifyUser, deleteBookedDate);

export default router