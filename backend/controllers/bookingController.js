import db from "../config/db.js";

/* CREATE BOOKING */
export const createBooking = (req, res) => {

  const { user_id, room_id, start_date, end_date } = req.body;

  const today = new Date().toISOString().split("T")[0];

  if (start_date < today || end_date < today) {
    return res.status(400).json({
      success: false,
      message: "Cannot book a room in the past"
    });
  }

  if (start_date >= end_date) {
    return res.status(400).json({
      success: false,
      message: "End date must be after start date"
    });
  }

  const checkQuery = `
    SELECT * FROM bookings
    WHERE room_id = ?
    AND start_date < ?
    AND end_date > ?
  `;

  db.query(checkQuery, [room_id, end_date, start_date], (err, results) => {

    if (err) {
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (results.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Room already booked for these dates"
      });
    }

    const insertQuery = `
      INSERT INTO bookings (user_id, room_id, start_date, end_date)
      VALUES (?, ?, ?, ?)
    `;

    db.query(insertQuery, [user_id, room_id, start_date, end_date], (err) => {

      if (err) {
        return res.status(500).json({ success: false, message: "Booking failed" });
      }

      res.status(201).json({
        success: true,
        message: "Room booked successfully"
      });

    });

  });

};


/* GET MY BOOKINGS */
export const getMyBookings = (req, res) => {

  const userId = req.params.userId;

  const sql = `
    SELECT bookings.*, rooms.name, rooms.price_per_night
    FROM bookings
    JOIN rooms ON bookings.room_id = rooms.id
    WHERE bookings.user_id = ?
  `;

  db.query(sql, [userId], (err, results) => {

    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error fetching bookings"
      });
    }

    res.json({
      success: true,
      bookings: results
    });

  });

};


/* CANCEL BOOKING */
export const cancelBooking = (req, res) => {

  const { id } = req.params;

  const sql = "DELETE FROM bookings WHERE id = ?";

  db.query(sql, [id], (err, result) => {

    if (err) {
      return res.status(500).json({ success: false, message: "Failed to cancel booking" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.json({ success: true, message: "Booking cancelled successfully" });

  });

};