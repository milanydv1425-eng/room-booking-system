import db from "../config/db.js";

export const getRooms = async (req, res) => {
  try {

    const [rooms] = await db.query("SELECT * FROM rooms");

    res.status(200).json({
      success: true,
      rooms: rooms
    });

  } catch (error) {

    console.error("Room Fetch Error:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching rooms"
    });

  }
};