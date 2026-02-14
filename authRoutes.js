const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Import User model
const User = require("../models/User");

const tokenBlacklist = new Set(); // for logout

// ---------------- SIGNUP ----------------
router.post("/signup", async (req, res) => {
  try {
    let { fullName, role, licenseId, email, mobile, password } = req.body;

    // Trim values
    fullName = fullName?.trim();
    role = role?.trim();
    licenseId = licenseId?.trim();
    email = email?.trim().toLowerCase();
    mobile = mobile?.trim();
    password = password?.trim();

    if (!fullName || !role || !licenseId || !email || !mobile || !password)
      return res.status(400).json({ message: "All fields are required" });

    // Check duplicates
    const existing = await User.findOne({
      $or: [{ mobile }, { email }, { licenseId }],
    });
    if (existing) {
      let msg = "";
      if (existing.mobile === mobile) msg = "Mobile already registered";
      else if (existing.email === email) msg = "Email already registered";
      else if (existing.licenseId === licenseId) msg = "License ID already registered";
      return res.status(400).json({ message: msg });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      role,
      licenseId,
      email,
      mobile,
      password: hashed,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ message: "Signup successful!", token });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ---------------- LOGIN ----------------
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email?.trim().toLowerCase();
    password = password?.trim();

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ---------------- LOGOUT ----------------
router.post("/logout", (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer TOKEN
    if (!token) return res.status(400).json({ message: "Token required" });

    tokenBlacklist.add(token);
    res.json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ---------------- AUTH MIDDLEWARE ----------------
function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    if (tokenBlacklist.has(token))
      return res.status(401).json({ message: "Token expired. Please login again." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized", error: err.message });
  }
}

module.exports = router;
module.exports.authMiddleware = authMiddleware;
