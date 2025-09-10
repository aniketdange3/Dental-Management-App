const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  age: { type: Number }, // Not required, computed
  address: { type: String, required: true },
  contactDetails: { type: String, required: true },
  city: { type: String, required: true },
  treatment: {
    type: String,
    required: true,
    enum: ['Dental Checkup', 'Dental Cleaning', 'Orthodontics', 'Dental Surgery', 'Cosmetic Dentistry']
  },
  fees: { type: Number, required: true },
  registeredDate: { type: Date, required: true },
  appointmentDate: { type: Date, required: true },
  image: { type: String } // Stores the filename of the uploaded image
});

// Pre-save hook to calculate age from dob
PatientSchema.pre('save', function(next) {
  if (this.dob) {
    const birthDate = new Date(this.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    this.age = age;
  }
  next();
});

module.exports = mongoose.model('Patient', PatientSchema);
