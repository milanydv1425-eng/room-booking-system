import db from "../config/db.js";

/* CREATE BOOKING */
export const createBooking = async (req, res) => {
  const { user_id, room_id, start_date, end_date } = req.body;

  const today = new Date().toISOString().split("T")[0];

  if (start_date < today || end_date < today) {
    return res.status(400).json({
      success: false,
      message: "Cannot book a room in the past",
    });
  }

  if (start_date >= end_date) {
    return res.status(400).json({
      success: false,
      message: "End date must be after start date",
    });
  }

  try {
    const [existingBookings] = await db.query(
      `SELECT * FROM bookings
       WHERE room_id = ?
       AND start_date < ?
       AND end_date > ?`,
      [room_id, end_date, start_date],
    );

    if (existingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Room already booked for these dates",
      });
    }

    await db.query(
      `INSERT INTO bookings (user_id, room_id, start_date, end_date)
       VALUES (?, ?, ?, ?)`,
      [user_id, room_id, start_date, end_date],
    );

    res.status(201).json({
      success: true,
      message: "Room booked successfully",
    });
  } catch (error) {
    console.error("Create Booking Error:", error);

    res.status(500).json({
      success: false,
      message: "Booking failed",
    });
  }
};

/* GET MY BOOKINGS */
export const getMyBookings = async (req, res) => {
  const userId = req.params.userId;

  try {
    const [bookings] = await db.query(
      `SELECT bookings.*, rooms.room_number, rooms.type, rooms.price
FROM bookings
JOIN rooms ON bookings.room_id = rooms.id
WHERE bookings.user_id = ?`,
      [userId],
    );

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Fetch Booking Error:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching bookings",
    });
  }
};

/* CANCEL BOOKING */
export const cancelBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM bookings WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel Booking Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
    });
  }
};
