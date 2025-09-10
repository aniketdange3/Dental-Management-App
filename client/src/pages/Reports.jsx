import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import {
  FaDownload,
  FaTooth,
  FaChartPie,
  FaFilePdf,
  FaFileWord,
  FaRupeeSign,
  FaUsers,
  FaMoneyBillWave,
  FaPercentage,
  FaCalendarAlt,
  FaInfoCircle,
  FaArrowUp,
  FaArrowDown,
  FaSearchDollar,
} from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Modern color palette
const COLORS = [
  '#3B82F6', // blue-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#EF4444', // red-500
  '#8B5CF6', // violet-500
  '#EC4899', // pink-500
  '#06B6D4', // cyan-500
  '#84CC16', // lime-500
  '#F97316', // orange-500
  '#6366F1', // indigo-500
  '#14B8A6', // teal-500
  '#A855F7', // purple-500
];

const Reports = () => {
  const [expenses, setExpenses] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [expensesRes, patientsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/expenses'),
          axios.get('http://localhost:5000/api/patients'),
        ]);
        setExpenses(expensesRes.data);
        setPatients(patientsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter data based on time range and search term
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const expenseDate = new Date(expense.date);
    const now = new Date();
    let matchesTimeRange = true;

    if (timeRange === 'week') {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      matchesTimeRange = expenseDate >= weekAgo;
    } else if (timeRange === 'month') {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
      matchesTimeRange = expenseDate >= monthAgo;
    } else if (timeRange === 'year') {
      const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
      matchesTimeRange = expenseDate >= yearAgo;
    }

    return matchesSearch && matchesTimeRange;
  });

  // Calculate metrics
  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalPatients = patients.length;
  const avgExpensePerPatient = totalPatients > 0 ? (totalExpenses / totalPatients).toFixed(2) : 0;

  const categoryTotals = filteredExpenses.reduce((acc, exp) => {
    const category = exp.category || 'General';
    acc[category] = (acc[category] || 0) + exp.amount;
    return acc;
  }, {});

  const expenseByCategory = Object.entries(categoryTotals).map(
    ([category, amount]) => ({ category, amount })
  ).sort((a, b) => b.amount - a.amount);

  const dentalExpenses = categoryTotals['Dental'] || categoryTotals['dental'] || 0;
  const dentalExpensePercentage = totalExpenses > 0
    ? ((dentalExpenses / totalExpenses) * 100).toFixed(2)
    : 0;

  const monthlyExpenses = filteredExpenses.reduce((acc, exp) => {
    const month = new Date(exp.date).toLocaleString('default', { month: 'short' });
    acc[month] = acc[month] || { patients: 0, amount: 0 };
    acc[month].patients += 1;
    acc[month].amount += exp.amount;
    return acc;
  }, {});

  const monthlyData = Object.entries(monthlyExpenses).map(
    ([month, data]) => ({ month, ...data })
  ).sort((a, b) => new Date(`2023-${a.month}-01`) - new Date(`2023-${b.month}-01`));

  const expensePieData = expenseByCategory.map((exp) => ({
    name: exp.category,
    value: exp.amount,
  }));

  // Top 3 expense categories
  const topCategories = [...expenseByCategory]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'Expenses' ? '₹' : ''}{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom legend for charts
  const renderCustomizedLegend = (props) => {
    const { payload } = props;
    return (
      <div className="flex justify-center flex-wrap gap-2 mt-4">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  // Download functions
  const downloadPDF = async () => {
    const input = document.getElementById('report-content');
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('dental-clinic-report.pdf');
  };

  const downloadWord = () => {
    console.log('Word Download Triggered');
    // Implement Word download logic here
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gradient-to-b from-blue-50 to-gray-50 min-h-screen">
      <motion.div
        className="mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center">
          <FaChartPie className="mr-2 text-blue-600" /> Reports & Analytics
        </h1>
        <p className="text-gray-600">Comprehensive financial overview of your dental practice</p>
      </motion.div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search expenses..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearchDollar className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Time Range:</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" id="summary-metrics">
        <motion.div
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-3">
                <FaUsers size={18} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Total Patients</h3>
                <p className="text-2xl font-bold text-gray-800">{totalPatients}</p>
              </div>
            </div>
            <div className={`p-1.5 rounded ${totalPatients > 0 ? 'bg-green-100' : 'bg-gray-100'}`}>
              <FaArrowUp className={`text-xs ${totalPatients > 0 ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
          </div>
          <p className="text-xs text-gray-500">All registered patients</p>
        </motion.div>

        <motion.div
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-3">
                <FaMoneyBillWave size={18} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Total Expenses</h3>
                <p className="text-2xl font-bold text-gray-800">₹{totalExpenses.toLocaleString()}</p>
              </div>
            </div>
            <div className={`p-1.5 rounded ${totalExpenses > 0 ? 'bg-green-100' : 'bg-gray-100'}`}>
              <FaArrowUp className={`text-xs ${totalExpenses > 0 ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
          </div>
          <p className="text-xs text-gray-500">For selected period</p>
        </motion.div>

        <motion.div
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-100 text-amber-600 mr-3">
                <FaPercentage size={18} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Dental Expense %</h3>
                <p className="text-2xl font-bold text-gray-800">{dentalExpensePercentage}%</p>
              </div>
            </div>
            <div className={`p-1.5 rounded ${dentalExpensePercentage > 0 ? 'bg-green-100' : 'bg-gray-100'}`}>
              <FaArrowUp className={`text-xs ${dentalExpensePercentage > 0 ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
          </div>
          <p className="text-xs text-gray-500">Of total expenses</p>
        </motion.div>

        <motion.div
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-3">
                <FaRupeeSign size={18} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Avg. Expense/Patient</h3>
                <p className="text-2xl font-bold text-gray-800">₹{avgExpensePerPatient}</p>
              </div>
            </div>
            <div className={`p-1.5 rounded ${avgExpensePerPatient > 0 ? 'bg-green-100' : 'bg-gray-100'}`}>
              <FaArrowUp className={`text-xs ${avgExpensePerPatient > 0 ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
          </div>
          <p className="text-xs text-gray-500">Average per patient</p>
        </motion.div>
      </div>

      {/* Download Buttons */}
      <div className="mb-8 flex flex-wrap gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition duration-300 flex items-center"
          onClick={downloadPDF}
        >
          <FaFilePdf className="mr-2" /> Export PDF Report
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 transition duration-300 flex items-center"
          onClick={downloadWord}
        >
          <FaFileWord className="mr-2" /> Export Word Report
        </motion.button>
      </div>

      {/* Main Content */}
      <div id="report-content" className="space-y-6">

        {/* Top Categories */}
        <motion.div
          className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <FaSearchDollar className="mr-2 text-amber-500" /> Top Expense Categories
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topCategories.map((category, index) => {
              const percentage = ((category.amount / totalExpenses) * 100).toFixed(1);
              return (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }} />
                      <h3 className="font-medium text-gray-800">{category.category}</h3>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: COLORS[index]
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-gray-800">₹{category.amount.toLocaleString()}</p>
                    <FaRupeeSign className="text-gray-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Overview Chart */}
          <motion.div
            className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaCalendarAlt className="mr-2 text-blue-500" /> Monthly Overview
            </h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend content={renderCustomizedLegend} />
                  <Bar
                    dataKey="patients"
                    name="Patients"
                    fill={COLORS[0]}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="amount"
                    name="Expenses"
                    fill={COLORS[1]}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Expense Distribution Chart */}
          <motion.div
            className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaChartPie className="mr-2 text-green-500" /> Expense Distribution
            </h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensePieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={50}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {expensePieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                    contentStyle={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Expense Breakdown Table */}
        <motion.div
          className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <FaMoneyBillWave className="mr-2 text-indigo-500" /> Expense Breakdown
            </h2>
            <span className="text-sm text-gray-500">
              {expenseByCategory.length} categories
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {expenseByCategory.map((exp, index) => {
                  const percentage = ((exp.amount / totalExpenses) * 100).toFixed(2);
                  return (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        {exp.category}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="flex items-center">
                          <FaRupeeSign className="text-gray-400 mr-1" size={12} />
                          {exp.amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{percentage}%</td>
                      <td className="px-4 py-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {expenseByCategory.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FaChartPie className="mx-auto text-4xl text-gray-300 mb-2" />
              <p>No expense data available</p>
            </div>
          )}
        </motion.div>

        {/* Recent Expenses */}
        <motion.div
          className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <FaMoneyBillWave className="mr-2 text-purple-500" /> Recent Expenses
            </h2>
            <span className="text-sm text-gray-500">
              {filteredExpenses.length} records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredExpenses.slice(0, 5).map((expense, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{expense.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{expense.category || 'General'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="flex items-center">
                        <FaRupeeSign className="text-gray-400 mr-1" size={12} />
                        {expense.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        new Date(expense.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {new Date(expense.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) ? 'Recent' : 'Older'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;
