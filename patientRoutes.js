// backend/routes/patientRoutes.js
const express = require("express");
const { addPatient, getPatients } = require("../controllers/patientController");

const router = express.Router();

router.post("/", addPatient);   // POST /api/patients
router.get("/", getPatients);   // GET  /api/patients (all)

module.exports = router;
