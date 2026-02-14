// backend/controllers/patientController.js
const Patient = require("../models/Patient");

exports.addPatient = async (req, res) => {
  try {
    console.log("📥 Received patient data:", req.body);

    const patient = new Patient(req.body);
    await patient.save();

    console.log("✅ Patient saved:", patient._id);
    res.status(201).json(patient);
  } catch (error) {
    console.error("❌ Error adding patient:", error);
    res.status(500).json({ error: "Error adding patient" });
  }
};

exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    console.log("📤 Returning patients:", patients.length);
    res.json(patients);
  } catch (error) {
    console.error("❌ Error fetching patients:", error);
    res.status(500).json({ error: "Error fetching patients" });
  }
};
