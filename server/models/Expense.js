
const mongoose = require('mongoose');

const expenseTypes = [
  'Groceries',
  'Rent',
  'Utilities',
  'Transport',
  'Materials',
  'Other',
  'Dental Cleaning',
  'Orthodontics',
  'Dental Surgery',
  'Cosmetic Dentistry'
];

const ExpenseSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Expense type is required'],
    enum: {
      values: expenseTypes,
      message: '{VALUE} is not a valid expense type'
    }
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be a positive number']
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Expense', ExpenseSchema);
