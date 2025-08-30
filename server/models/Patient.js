const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  address: { type: String, required: true },
  contactDetails: { type: String, required: true },
  dateAdded: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', PatientSchema);
