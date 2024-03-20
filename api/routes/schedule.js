const express = require("express");
const { retrieveLecturers, retrieveBookings, deleteBookedDate } = require("../controllers/schedule.js");
const { verifyUser } = require("../utils/verifyToken.js");

const router = express.Router();

router.get("/retrievelecturers", verifyUser, retrieveLecturers);
router.get("/retrievebookings", verifyUser, retrieveBookings);
router.delete("/:username/:date", verifyUser, deleteBookedDate);

module.exports = router;
