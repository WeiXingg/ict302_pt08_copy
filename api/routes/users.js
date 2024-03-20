const express = require("express");
const { deleteUser, getAllUser, getUser, updateUser, addBookedDate } = require("../controllers/user.js");
const { verifyAdmin, verifyUser } = require("../utils/verifyToken.js");

const router = express.Router();

//UPDATE
router.put("/:id", verifyUser, updateUser);

//DELETE
router.delete("/:id", verifyUser, deleteUser);

//GET
router.get("/:identifier", verifyUser, getUser);

//GET ALL
router.get("/", verifyAdmin, getAllUser);

// POST to add booked date
router.post("/:username", verifyUser, addBookedDate);

module.exports = router;
