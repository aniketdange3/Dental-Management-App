// pages/Expenses.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import ExpenseHeader from '../components/Expense/ExpenseHeader';
import ExpenseFilter from '../components/Expense/ExpenseFilter';
import ExpenseActions from '../components/Expense/ExpenseActions';
import ExpenseModal from '../components/Expense/ExpenseModal';
import ExpenseViewModal from '../components/Expense/ExpenseViewModal';
import { FaChartLine } from 'react-icons/fa';
import ExpenseTable from '../components/Expense/ExpenseTable';

const expenseTypes = [
  'Supplements',
  'Equipment',
  'Supplies',
  'Utilities',
  'Staff',
  'Other',
];

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    amount: '',
    date: '',
  });
  const [filterType, setFilterType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingExpense, setViewingExpense] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/expenses');
      setExpenses(
        response.data.map((exp) => ({
          ...exp,
          isToday: new Date(exp.date).toDateString() === new Date().toDateString(),
        }))
      );
      setLoading(false);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to fetch expenses');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const expenseData = {
      type: formData.type,
      description: formData.description,
      amount: parseFloat(formData.amount),
      date: formData.date || new Date().toISOString(),
    };
    try {
      if (editingExpense) {
        const response = await axios.put(`http://localhost:5000/api/expenses/${editingExpense._id}`, expenseData);
        setExpenses(expenses.map(exp => exp._id === editingExpense._id ? { ...response.data, isToday: new Date(response.data.date).toDateString() === new Date().toDateString() } : exp));
        toast.success('Expense updated!');
      } else {
        const response = await axios.post('http://localhost:5000/api/expenses', expenseData);
        setExpenses([...expenses, { ...response.data, isToday: new Date(response.data.date).toDateString() === new Date().toDateString() }]);
        toast.success('Expense added!');
      }
      resetForm();
      await fetchExpenses();
    } catch (error) {
      console.error('Error saving expense:', error);
      toast.error('Failed to save expense');
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      type: expense.type,
      description: expense.description,
      amount: expense.amount.toString(),
      date: new Date(expense.date).toISOString().slice(0, 16)
    });
    setIsModalOpen(true);
  };

  const handleView = (expense) => {
    setViewingExpense(expense);
    setIsViewModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      setExpenses(expenses.filter(expense => expense._id !== id));
      toast.success('Expense deleted!');
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    }
  };

  const resetForm = () => {
    setFormData({ type: '', description: '', amount: '', date: '' });
    setEditingExpense(null);
    setIsModalOpen(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Expenses Report', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    let y = 32;
    const headers = ['Type', 'Description', 'Amount (₹)', 'Date & Time'];
    headers.forEach((header, i) => {
      doc.text(header, 14 + i * 45, y);
    });
    y += 10;
    filteredExpenses.forEach((exp) => {
      doc.text(exp.type, 14, y);
      doc.text(exp.description, 59, y);
      doc.text(`₹${exp.amount.toFixed(2)}`, 104, y);
      doc.text(new Date(exp.date).toLocaleString(), 149, y);
      y += 10;
    });
    doc.save('expenses.pdf');
  };

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Type,Description,Amount (₹),Date & Time\n"
      + filteredExpenses.map(exp => `${exp.type},${exp.description},${exp.amount.toFixed(2)},${new Date(exp.date).toLocaleString()}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <FaChartLine className="mr-2 text-indigo-600" /> Loading Expenses
          </h1>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  const filteredExpenses = filterType
    ? expenses.filter((expense) => expense.type === filterType)
    : expenses;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <ExpenseHeader totalExpenses={filteredExpenses.length} />
        {/* Filters & Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <ExpenseFilter
            filterType={filterType}
            setFilterType={setFilterType}
            expenseTypes={expenseTypes}
          />
          <ExpenseActions
            onAdd={() => setIsModalOpen(true)}
            onExportPDF={exportToPDF}
            onExportCSV={exportToCSV}
          />
        </div>
        {/* Expenses List */}
<div className="mt-6">
  {filteredExpenses.length === 0 ? (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
      <p className="text-gray-500">No expenses found</p>
    </div>
  ) : (
    <ExpenseTable
      expenses={filteredExpenses}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  )}
</div>
        {/* Modals */}
        <ExpenseModal
          isOpen={isModalOpen}
          onClose={resetForm}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          editingExpense={editingExpense}
          expenseTypes={expenseTypes}
        />
        <ExpenseViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          expense={viewingExpense}
        />
        <Toaster position="top-right" />
      </div>
    </div>
  );
};

export default Expenses;
