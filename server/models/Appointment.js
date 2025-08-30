const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  date: { type: Date, required: true },
  treatment: { type: String, required: true },
  status: { type: String, default: 'Scheduled' }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
