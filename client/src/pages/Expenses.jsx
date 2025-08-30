
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FaMoneyBillWave, FaDownload, FaPlus, FaEdit, FaTrash, FaFilter } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, HeadingLevel } from 'docx';
import toast, { Toaster } from 'react-hot-toast';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const expenseTypes = [
  'Groceries', 'Rent', 'Utilities', 'Transport', 'Entertainment', 'Other',
  'Dental Checkup', 'Dental Cleaning', 'Orthodontics', 'Dental Surgery', 'Cosmetic Dentistry'
];

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('');
  const [filterType, setFilterType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/expenses');
        setExpenses(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching expenses:', error);
        toast.error('Failed to fetch expenses', {
          style: { background: '#fee2e2', color: '#b91c1c' },
        });
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const expenseData = {
      type,
      description,
      amount: parseFloat(amount),
      date: new Date().toISOString(),
    };

    try {
      if (editingExpense) {
        // Update existing expense
        const response = await axios.put(`http://localhost:5000/api/expenses/${editingExpense._id}`, expenseData);
        setExpenses(expenses.map(exp => exp._id === editingExpense._id ? response.data : exp));
        toast.success('Expense updated successfully!', {
          icon: <FaEdit className="text-blue-600" />,
          style: { background: '#bfdbfe', color: '#1e40af' },
        });
      } else {
        // Add new expense
        const response = await axios.post('http://localhost:5000/api/expenses', expenseData);
        setExpenses([...expenses, response.data]);
        toast.success('Expense added successfully!', {
          icon: <FaPlus className="text-green-600" />,
          style: { background: '#bbf7d0', color: '#15803d' },
        });
      }
      resetForm();
    } catch (error) {
      console.error('Error saving expense:', error);
      toast.error('Failed to save expense', {
        style: { background: '#fee2e2', color: '#b91c1c' },
      });
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setType(expense.type);
    setDescription(expense.description);
    setAmount(expense.amount.toString());
    setIsModalOpen(true); // Ensure modal opens
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      setExpenses(expenses.filter(expense => expense._id !== id));
      toast.success('Expense deleted successfully!', {
        icon: <FaTrash className="text-red-600" />,
        style: { background: '#fee2e2', color: '#b91c1c' },
      });
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense', {
        style: { background: '#fee2e2', color: '#b91c1c' },
      });
    }
  };

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setType('');
    setEditingExpense(null);
    setIsModalOpen(false);
  };

  const filteredExpenses = filterType
    ? expenses.filter(expense => expense.type.toLowerCase() === filterType.toLowerCase())
    : expenses;

  // Aggregate chart data by type
  const chartData = {
    labels: expenseTypes,
    datasets: [{
      label: 'Expenses (₹)',
      data: expenseTypes.map(type =>
        filteredExpenses.filter(exp => exp.type === type).reduce((sum, exp) => sum + exp.amount, 0)
      ),
      backgroundColor: [
        'rgba(59, 130, 246, 0.6)', // Blue
        'rgba(239, 68, 68, 0.6)',  // Red
        'rgba(16, 185, 129, 0.6)', // Green
        'rgba(245, 158, 11, 0.6)', // Amber
        'rgba(139, 92, 246, 0.6)', // Purple
        'rgba(236, 72, 153, 0.6)', // Pink
        'rgba(34, 197, 94, 0.6)',  // Light Green
        'rgba(249, 115, 22, 0.6)', // Orange
        'rgba(168, 85, 247, 0.6)', // Light Purple
        'rgba(20, 184, 166, 0.6)', // Teal
        'rgba(250, 204, 21, 0.6)', // Yellow
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(239, 68, 68, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(139, 92, 246, 1)',
        'rgba(236, 72, 153, 1)',
        'rgba(34, 197, 94, 1)',
        'rgba(249, 115, 22, 1)',
        'rgba(168, 85, 247, 1)',
        'rgba(20, 184, 166, 1)',
        'rgba(250, 204, 21, 1)',
      ],
      borderWidth: 1,
    }],
  };

  // Download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor('#1e40af');
    doc.text('🦷 Dental Clinic Expenses', 20, 20);
    doc.setFontSize(14);
    doc.setTextColor('#1f2937');
    doc.text('Expense Report', 20, 30);
    filteredExpenses.forEach((expense, i) => {
      doc.text(
        `${expense.type} - ${expense.description}: ₹${expense.amount.toFixed(2)} (${new Date(expense.date).toLocaleString()})`,
        30,
        40 + i * 10
      );
    });
    doc.save('Dental_Clinic_Expenses.pdf');
    toast.success('PDF Downloaded!', {
      icon: <FaDownload className="text-blue-600" />,
      style: { background: '#bfdbfe', color: '#1e40af' },
    });
  };

  // Download Word
  const downloadWord = async () => {
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            text: '🦷 Dental Clinic Expenses',
            heading: HeadingLevel.HEADING_1,
            alignment: 'center',
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'Expense Report',
            heading: HeadingLevel.HEADING_2,
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Type')] }),
                  new TableCell({ children: [new Paragraph('Description')] }),
                  new TableCell({ children: [new Paragraph('Amount (₹)')] }),
                  new TableCell({ children: [new Paragraph('Date')] }),
                ],
              }),
              ...filteredExpenses.map(expense => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(expense.type)] }),
                  new TableCell({ children: [new Paragraph(expense.description)] }),
                  new TableCell({ children: [new Paragraph(`₹${expense.amount.toFixed(2)}`)] }),
                  new TableCell({ children: [new Paragraph(new Date(expense.date).toLocaleString())] }),
                ],
              })),
            ],
          }),
        ],
      }],
    });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Dental_Clinic_Expenses.docx';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Word Document Downloaded!', {
      icon: <FaDownload className="text-green-600" />,
      style: { background: '#bbf7d0', color: '#15803d' },
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
        <h1 className="text-4xl font-bold text-blue-800 mb-6 flex items-center">
          <FaMoneyBillWave className="mr-2 animate-spin" /> Dental Expense Tracker
        </h1>
        <p className="text-gray-600">Loading...</p>
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
      <h1 className="text-4xl font-bold text-blue-800 mb-6 flex items-center">
        <FaMoneyBillWave className="mr-2" /> Dental Expense Tracker
      </h1>

      {/* Filter and Add/Edit Buttons */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
        <div className="flex items-center mb-4 sm:mb-0">
          <FaFilter className="mr-2 text-blue-600" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg w-full max-w-xs focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            <option value="">All Types</option>
            {expenseTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setEditingExpense(null);
              setIsModalOpen(true); // Force modal open
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 flex items-center"
          >
            <FaPlus className="mr-2" /> Add New Expense
          </button>
          <button
            onClick={downloadPDF}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 flex items-center"
          >
            <FaDownload className="mr-2" /> Download PDF
          </button>
          <button
            onClick={downloadWord}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 flex items-center"
          >
            <FaDownload className="mr-2" /> Download Word
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-95">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <FaMoneyBillWave className="mr-2 text-blue-600" />
              {editingExpense ? 'Edit Expense' : 'Add Expense'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200"
                  required
                >
                  <option value="" disabled>Select Type</option>
                  {expenseTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center"
                >
                  <FaPlus className="mr-2" />
                  {editingExpense ? 'Update Expense' : 'Add Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expenses Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <table className="min-w-full">
          <thead className="bg-blue-100">
            <tr>
              <th className="py-3 px-4 text-left text-blue-800 font-semibold">Type</th>
              <th className="py-3 px-4 text-left text-blue-800 font-semibold">Description</th>
              <th className="py-3 px-4 text-left text-blue-800 font-semibold">Amount (₹)</th>
              <th className="py-3 px-4 text-left text-blue-800 font-semibold">Date & Time</th>
              <th className="py-3 px-4 text-left text-blue-800 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-3 px-4 text-center text-gray-600">No expenses found</td>
              </tr>
            ) : (
              filteredExpenses.map(expense => (
                <tr key={expense._id} className="border-b hover:bg-blue-50 transition duration-200">
                  <td className="py-3 px-4">{expense.type}</td>
                  <td className="py-3 px-4">{expense.description}</td>
                  <td className="py-3 px-4">₹{expense.amount.toFixed(2)}</td>
                  <td className="py-3 px-4">{new Date(expense.date).toLocaleString()}</td>
                  <td className="py-3 px-4 space-x-2">
                    <button
                      onClick={() => handleEdit(expense)}
                      className="text-blue-500 hover:text-blue-700 transition duration-200"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(expense._id)}
                      className="text-red-500 hover:text-red-700 transition duration-200"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Bar Chart */}
      {filteredExpenses.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaMoneyBillWave className="mr-2 text-blue-600" /> Expense Overview
          </h2>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                  labels: { color: '#1f2937', font: { size: 14 } },
                },
                title: {
                  display: true,
                  text: 'Expenses by Type',
                  color: '#1f2937',
                  font: { size: 18, weight: 'bold' },
                },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const type = context.label;
                      const amount = context.raw;
                      return `${type}: ₹${amount.toFixed(2)}`;
                    },
                  },
                },
              },
              scales: {
                x: { grid: { display: false }, ticks: { color: '#1f2937' } },
                y: {
                  grid: { color: 'rgba(209, 213, 219, 0.3)' },
                  ticks: { color: '#1f2937', callback: (value) => `₹${value}` },
                },
              },
            }}
          />
        </div>
      )}
      <Toaster position="top-right" />
    </div>
  );
};

export default Expenses;