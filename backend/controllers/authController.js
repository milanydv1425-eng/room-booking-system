import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* REGISTER */
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const checkUser = "SELECT * FROM users WHERE email=? OR name=?";

    db.query(checkUser, [email, name], async (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database error",
        });
      }

      if (results.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Username or Email already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const sql = "INSERT INTO users (name,email,password) VALUES (?,?,?)";

      db.query(sql, [name, email, hashedPassword], (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Registration failed",
          });
        }

        res.status(201).json({
          success: true,
          message: "User registered successfully",
        });
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* LOGIN */
export const login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email=?";

  db.query(sql, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    if (results.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const user = results[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    console.log("USER FROM DB:", user);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  });
};
