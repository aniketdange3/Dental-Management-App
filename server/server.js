const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI,)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
const patientRoutes = require('./routes/patients');
const expenseRoutes = require('./routes/expenses');
const appointmentRoutes = require('./routes/appointments');

app.use('/api/patients', patientRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/appointments', appointmentRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
