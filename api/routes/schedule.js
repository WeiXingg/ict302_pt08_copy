import express from "express"
import { retrieveLecturers, retrieveBookings } from "../controllers/schedule.js"
import { verifyUser } from "../utils/verifyToken.js"

const router = express.Router();

router.get("/retrievelecturers", verifyUser, retrieveLecturers);
router.get("/retrievebookings", verifyUser, retrieveBookings);

export default router