// backend/models/Patient.js
const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: String,
    mobile: String,
    pregnancyMonth: Number,
    age: Number,
    bp: Number,
    diastolic: Number,
    bs: Number,
    temp: Number,
    bmi: Number,
    hr: Number,
    prevComplications: String,
    preDiabetes: String,
    gestDiabetes: String,
    mental: String,
    risk: String,

    // link to doctor/nurse. Make it NOT required for safety while debugging
    doctorLicenseId: { type: String }, // remove "required: true" for now
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
