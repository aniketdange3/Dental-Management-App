import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FaTag, FaNotesMedical, FaRupeeSign, FaCalendarAlt,
  FaTimes, FaSave, FaPlus, FaTrash, FaMoneyBillWave
} from 'react-icons/fa';

const ExpenseModal = ({ expense, onClose, onUpdate, isNew = false }) => {
  const [formData, setFormData] = useState(isNew ? {
    type: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: ''
  } : { ...expense });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      if (isNew) {
        await axios.post('http://localhost:5000/api/expenses', payload);
        toast.success('Expense added successfully!');
      } else {
        await axios.put(`http://localhost:5000/api/expenses/${expense._id}`, payload);
        toast.success('Expense updated successfully!');
      }

      onUpdate();
      onClose();
    } catch (error) {
      toast.error(isNew ? 'Failed to add expense' : 'Failed to update expense');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await axios.delete(`http://localhost:5000/api/expenses/${expense._id}`);
        toast.success('Expense deleted successfully!');
        onUpdate();
        onClose();
      } catch (error) {
        toast.error('Failed to delete expense');
        console.error(error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <FaMoneyBillWave className="mr-2 text-blue-600" />
            {isNew ? 'Add Expense' : 'Edit Expense'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition p-1"
            title="Close"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-4">
            {/* Expense Type */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center">
                <FaTag className="mr-2 text-gray-500" /> Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Type</option>
                <option value="Supplements">Supplements</option>
                <option value="Lab Fees">Lab Fees</option>
                <option value="Equipment">Equipment</option>
                <option value="Supplies">Supplies</option>
                <option value="Utilities">Utilities</option>
                <option value="Staff">Staff</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center">
                <FaTag className="mr-2 text-gray-500" /> Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                <option value="Dental">Dental</option>
                <option value="Administrative">Administrative</option>
                <option value="Equipment">Equipment</option>
                <option value="Supplies">Supplies</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center">
                <FaNotesMedical className="mr-2 text-gray-500" /> Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="2"
                placeholder="Enter expense description..."
              />
            </div>

            {/* Amount and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center">
                  <FaRupeeSign className="mr-2 text-gray-500" /> Amount (₹)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center">
                  <FaCalendarAlt className="mr-2 text-gray-500" /> Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            {!isNew && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition flex items-center"
                title="Delete Expense"
              >
                <FaTrash className="mr-2" /> Delete
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center"
              title="Cancel"
            >
              <FaTimes className="mr-2" /> Cancel
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
              title={isNew ? "Add Expense" : "Update Expense"}
            >
              {isNew ? (
                <>
                  <FaPlus className="mr-2" /> Add
                </>
              ) : (
                <>
                  <FaSave className="mr-2" /> Update
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ExpenseModal;
