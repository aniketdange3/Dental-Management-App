const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Patient = require('../models/Patient');

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Get all patients
router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patients', error: error.message });
  }
});

// Create a new patient
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const patientData = {
      name: req.body.name,
      dob: req.body.dob,
      gender: req.body.gender,
      address: req.body.address,
      contactDetails: req.body.contactDetails,
      city: req.body.city,
      treatment: req.body.treatment,
      fees: req.body.fees,
      registeredDate: req.body.registeredDate,
      appointmentDate: req.body.appointmentDate,
      image: req.file ? req.file.filename : null,
    };

    const patient = new Patient(patientData);
    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ message: 'Error creating patient', error: error.message });
  }
});

// Update a patient
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const patientData = {
      name: req.body.name,
      dob: req.body.dob,
      gender: req.body.gender,
      address: req.body.address,
      contactDetails: req.body.contactDetails,
      city: req.body.city,
      treatment: req.body.treatment,
      fees: req.body.fees,
      registeredDate: req.body.registeredDate,
      appointmentDate: req.body.appointmentDate,
      image: req.file ? req.file.filename : req.body.image || null,
    };

    const patient = await Patient.findByIdAndUpdate(req.params.id, patientData, { new: true, runValidators: true });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    res.status(400).json({ message: 'Error updating patient', error: error.message });
  }
});

// Delete a patient
router.delete('/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json({ message: 'Patient deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting patient', error: error.message });
  }
});

module.exports = router;
