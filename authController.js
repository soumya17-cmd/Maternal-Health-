// backend/controllers/authController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import twilio from "twilio";

const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

// 🧩 SIGNUP CONTROLLER (License Validation)
export const signup = async (req, res) => {
  try {
    const { fullName, role, licenseId, email, mobile, password } = req.body;

    // Check valid license ID
    const validLicense = await User.findOne({ licenseId });
    if (!validLicense) {
      return res.status(400).json({ message: "Invalid or unregistered license ID." });
    }

    // Check duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      role,
      licenseId,
      email,
      mobile,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Signup successful!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

