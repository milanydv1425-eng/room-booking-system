import db from "../config/db.js";

export const getRooms = (req, res) => {

  const sql = "SELECT * FROM rooms";

  db.query(sql, (err, results) => {

    if (err) {
      return res.status(500).json({ message: "Error fetching rooms" });
    }

    res.json({
      success: true,
      rooms: results
    });

  });

};