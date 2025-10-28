const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ✅ Register User
exports.registerUser = (req, res) => {
  const { first_name, last_name, email, phone, password } = req.body;

  if (!first_name || !email || !phone || !password) {
    return res.status(400).json({ message: "All required fields must be provided" });
  }

  db.query(
    "SELECT * FROM users WHERE email = ? OR phone = ?",
    [email, phone],
    async (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", err });

      if (results.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO users (first_name, last_name, email, phone, password) VALUES (?, ?, ?, ?, ?)",
        [first_name, last_name, email, phone, hashedPassword],
        (err, result) => {
          if (err) return res.status(500).json({ message: "Error inserting user", err });

          res.status(201).json({
            message: "User registered successfully",
            user_id: result.insertId,
          });
        }
      );
    }
  );
};

// ✅ Login User
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", err });

    if (results.length === 0)
      return res.status(404).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, results[0].password);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: results[0].id, email: results[0].email },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: results[0].id,
        first_name: results[0].first_name,
        last_name: results[0].last_name,
        email: results[0].email,
        phone: results[0].phone,
      },
    });
  });
};
