import express from "express";
import { createBooking, getMyBookings, cancelBooking } from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/my/:userId", getMyBookings);
router.delete("/:id", cancelBooking);

export default router;