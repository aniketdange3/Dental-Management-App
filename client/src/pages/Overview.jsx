
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTooth, FaMoneyBillWave, FaCalendarCheck, FaDownload, FaSync } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, HeadingLevel } from 'docx';
import toast, { Toaster } from 'react-hot-toast';

const Overview = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalEarnings: 0,
    totalAppointments: 0,
    totalExpenses: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [patientsRes, appointmentsRes, expensesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/patients'),
        axios.get('http://localhost:5000/api/appointments'),
        axios.get('http://localhost:5000/api/expenses'),
      ]);

      const totalEarnings = appointmentsRes.data.reduce((sum) => sum + 500, 0); // ₹500 per appointment
      const totalExpenses = expensesRes.data.reduce((sum, expense) => sum + expense.amount, 0);

      setStats({
        totalPatients: patientsRes.data.length,
        totalEarnings,
        totalAppointments: appointmentsRes.data.length,
        totalExpenses,
      });
      setLoading(false);
      toast.success('Data loaded successfully!', {
        icon: <FaSync className="text-blue-600" />,
        style: { background: '#bfdbfe', color: '#1e40af' },
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load data', {
        icon: '❌',
        style: { background: '#fee2e2', color: '#b91c1c' },
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor('#1e40af');
    doc.text('🦷 Dental Clinic Overview', 20, 20);
    doc.setFontSize(14);
    doc.setTextColor('#1f2937');
    doc.text('Summary Statistics', 20, 30);
    doc.text(`Total Patients: ${stats.totalPatients}`, 30, 40);
    doc.text(`Total Earnings: ₹${stats.totalEarnings.toFixed(2)}`, 30, 50);
    doc.text(`Total Appointments: ${stats.totalAppointments}`, 30, 60);
    doc.text(`Total Expenses: ₹${stats.totalExpenses.toFixed(2)}`, 30, 70);
    doc.text(`Net Profit: ₹${(stats.totalEarnings - stats.totalExpenses).toFixed(2)}`, 30, 80);
    
    doc.save('Dental_Clinic_Overview.pdf');
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
            text: '🦷 Dental Clinic Overview',
            heading: HeadingLevel.HEADING_1,
            alignment: 'center',
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'Summary Statistics',
            heading: HeadingLevel.HEADING_2,
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Metric')] }),
                  new TableCell({ children: [new Paragraph('Value')] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Total Patients')] }),
                  new TableCell({ children: [new Paragraph(`${stats.totalPatients}`)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Total Earnings')] }),
                  new TableCell({ children: [new Paragraph(`₹${stats.totalEarnings.toFixed(2)}`)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Total Appointments')] }),
                  new TableCell({ children: [new Paragraph(`${stats.totalAppointments}`)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Total Expenses')] }),
                  new TableCell({ children: [new Paragraph(`₹${stats.totalExpenses.toFixed(2)}`)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Net Profit')] }),
                  new TableCell({ children: [new Paragraph(`₹${(stats.totalEarnings - stats.totalExpenses).toFixed(2)}`)] }),
                ],
              }),
            ],
          }),
        ],
      }],
    });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Dental_Clinic_Overview.docx';
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
          <FaTooth className="mr-2 animate-spin" /> Dental Clinic Overview
        </h1>
        <p className="text-gray-600">Loading...</p>
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
      <h1 className="text-4xl font-bold text-blue-800 mb-6 flex items-center">
        <FaTooth className="mr-2" /> Dental Clinic Overview
      </h1>

      {/* Refresh Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 flex items-center"
        >
          <FaSync className="mr-2 animate-spin" /> Refresh Data
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-600 transform hover:scale-105 transition duration-300">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <FaTooth className="mr-2 text-blue-600" /> Total Patients
          </h2>
          <p className="text-3xl font-bold text-blue-600 animate-pulse">{stats.totalPatients}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-600 transform hover:scale-105 transition duration-300">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <FaMoneyBillWave className="mr-2 text-green-600" /> Total Earnings
          </h2>
          <p className="text-3xl font-bold text-green-600 animate-pulse">₹{stats.totalEarnings.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-600 transform hover:scale-105 transition duration-300">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <FaCalendarCheck className="mr-2 text-purple-600" /> Total Appointments
          </h2>
          <p className="text-3xl font-bold text-purple-600 animate-pulse">{stats.totalAppointments}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-600 transform hover:scale-105 transition duration-300">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <FaMoneyBillWave className="mr-2 text-red-600" /> Total Expenses
          </h2>
          <p className="text-3xl font-bold text-red-600 animate-pulse">₹{stats.totalExpenses.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-teal-600 transform hover:scale-105 transition duration-300">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <FaMoneyBillWave className="mr-2 text-teal-600" /> Net Profit
          </h2>
          <p className="text-3xl font-bold text-teal-600 animate-pulse">
            ₹{(stats.totalEarnings - stats.totalExpenses).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Download Buttons */}
      <div className="mb-6 flex space-x-4">
        <button
          onClick={downloadPDF}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 flex items-center"
        >
          <FaDownload className="mr-2" /> Download PDF
        </button>
        <button
          onClick={downloadWord}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 flex items-center"
        >
          <FaDownload className="mr-2" /> Download Word
        </button>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default Overview;
