import { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import {
  FaTooth,
  FaMoneyBillWave,
  FaCalendarCheck,
  FaDownload,
  FaSync,
  FaChevronLeft,
  FaChevronRight,
  FaUserInjured,
  FaFileMedical,
  FaNotesMedical,
  FaFilePdf,
  FaFileWord
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, HeadingLevel } from 'docx';
import toast, { Toaster } from 'react-hot-toast';

// Register ChartJS components
ChartJS.register(BarElement, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const PatientProfile = ({ patient, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Patient Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/3 flex justify-center">
              <div className="w-48 h-48 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-gray-200">
                {patient.photo ? (
                  <img src={patient.photo} alt={patient.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-5xl">
                    <FaUserInjured />
                  </div>
                )}
              </div>
            </div>
            <div className="lg:w-2/3 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-700 border-b-2 border-blue-500 pb-2">General Information</h3>
                  <div className="space-y-3">
                    <p><span className="font-medium text-gray-600">Name:</span> <span className="text-gray-800">{patient.name}</span></p>
                    <p><span className="font-medium text-gray-600">Date of Birth:</span> <span className="text-gray-800">{new Date(patient.dob).toLocaleDateString()}</span></p>
                    <p><span className="font-medium text-gray-600">Address:</span> <span className="text-gray-800">{patient.address}</span></p>
                    <p><span className="font-medium text-gray-600">Registration Date:</span> <span className="text-gray-800">{new Date(patient.registrationDate).toLocaleDateString()}</span></p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-700 border-b-2 border-blue-500 pb-2">Medical Information</h3>
                  <div className="space-y-3">
                    <p><span className="font-medium text-gray-600">Allergies:</span> <span className="text-gray-800">{patient.allergies || 'None'}</span></p>
                    <p><span className="font-medium text-gray-600">Chronic Diseases:</span> <span className="text-gray-800">{patient.chronicDiseases || 'None'}</span></p>
                    <p><span className="font-medium text-gray-600">Blood Type:</span> <span className="text-gray-800">{patient.bloodType || 'Not specified'}</span></p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700 border-b-2 border-blue-500 pb-2">Files</h3>
                <div className="space-y-3">
                  {patient.files && patient.files.length > 0 ? (
                    patient.files.map((file, index) => (
                      <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm">
                        <FaFileMedical className="mr-3 text-blue-500 text-xl" />
                        <span className="flex-1 text-gray-700">{file.name}</span>
                        <button className="text-blue-500 hover:text-blue-700 text-sm font-medium">Download</button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No files available</p>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700 border-b-2 border-blue-500 pb-2">Notes</h3>
                <div className="space-y-4">
                  {patient.notes && patient.notes.length > 0 ? (
                    patient.notes.map((note, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                        <div className="flex justify-between items-start">
                          <p className="text-gray-700">{note.content}</p>
                          <span className="text-xs text-gray-500 ml-2">{new Date(note.date).toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No notes available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Overview = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalEarnings: 0,
    totalAppointments: 0,
    totalExpenses: 0,
  });
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedPatient, setSelectedPatient] = useState(null);

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
      setPatients(patientsRes.data);
      setAppointments(appointmentsRes.data);
      setExpenses(expensesRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load data', {
        icon: '❌',
        style: { background: '#f3f4f6', color: '#374151' },
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Combined data for table
  const combinedData = [
    ...patients.map((p) => ({
      type: 'Patient',
      name: p.name,
      date: new Date(p.registrationDate).toLocaleString(),
      details: p.treatment || '-',
      amount: '-',
      bgColor: 'bg-green-50',
      patientId: p._id,
    })),
    ...appointments.map((a) => ({
      type: 'Appointment',
      name: a.patientId ? patients.find((p) => p._id === a.patientId)?.name || 'Unknown' : 'Unknown',
      date: new Date(a.date).toLocaleString(),
      details: a.treatment || '-',
      amount: '₹500.00',
      bgColor: 'bg-blue-50',
    })),
    ...expenses.map((e) => ({
      type: 'Expense',
      name: e.type,
      date: new Date(e.date).toLocaleString(),
      details: e.description,
      amount: `₹${e.amount.toFixed(2)}`,
      bgColor: 'bg-red-50',
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = combinedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(combinedData.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Chart data
  const appointmentChartData = {
    labels: months,
    datasets: [{
      label: 'Appointments',
      data: months.map((_, index) =>
        appointments.filter(a => new Date(a.date).getMonth() === index).length
      ),
      backgroundColor: '#3b82f6',
      borderColor: '#2563eb',
      borderWidth: 1,
    }],
  };

  const earningsChartData = {
    labels: months,
    datasets: [{
      label: 'Earnings (₹)',
      data: months.map((_, index) =>
        appointments.filter(a => new Date(a.date).getMonth() === index).length * 500
      ),
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: '#3b82f6',
      fill: true,
      tension: 0.4,
    }],
  };

  const expensesChartData = {
    labels: months,
    datasets: [{
      label: 'Expenses (₹)',
      data: months.map((_, index) =>
        expenses.filter(e => new Date(e.date).getMonth() === index).reduce((sum, e) => sum + e.amount, 0)
      ),
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      borderColor: '#ef4444',
      fill: true,
      tension: 0.4,
    }],
  };

  // Download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('🦷 Dental Clinic Overview', 20, 20);
    doc.setFontSize(14);
    doc.text('Summary Statistics', 20, 30);
    doc.text(`Total Patients: ${stats.totalPatients}`, 30, 40);
    doc.text(`Total Earnings: ₹${stats.totalEarnings.toFixed(2)}`, 30, 50);
    doc.text(`Total Appointments: ${stats.totalAppointments}`, 30, 60);
    doc.text(`Total Expenses: ₹${stats.totalExpenses.toFixed(2)}`, 30, 70);
    doc.text(`Net Profit: ₹${(stats.totalEarnings - stats.totalExpenses).toFixed(2)}`, 30, 80);
    let yOffset = 90;
    doc.text('Combined Data', 20, yOffset);
    combinedData.forEach((item, i) => {
      if (yOffset > 250) {
        doc.addPage();
        yOffset = 20;
      }
      doc.text(
        `${item.type}: ${item.name} - ${item.details} (${item.date})${item.amount !== '-' ? ` - ${item.amount}` : ''}`,
        20, yOffset + 10 + (i * 10)
      );
      yOffset += 10;
    });
    doc.save('Dental_Clinic_Overview.pdf');
    toast.success('PDF Downloaded!', {
      icon: <FaDownload className="text-gray-600" />,
      style: { background: '#e5e7eb', color: '#374151' },
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
          new Paragraph({
            text: 'Combined Data',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Type')] }),
                  new TableCell({ children: [new Paragraph('Name')] }),
                  new TableCell({ children: [new Paragraph('Details')] }),
                  new TableCell({ children: [new Paragraph('Date')] }),
                  new TableCell({ children: [new Paragraph('Amount')] }),
                ],
              }),
              ...combinedData.map(item => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(item.type)] }),
                  new TableCell({ children: [new Paragraph(item.name)] }),
                  new TableCell({ children: [new Paragraph(item.details)] }),
                  new TableCell({ children: [new Paragraph(item.date)] }),
                  new TableCell({ children: [new Paragraph(item.amount)] }),
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
    link.download = 'Dental_Clinic_Overview.docx';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Word Document Downloaded!', {
      icon: <FaDownload className="text-gray-600" />,
      style: { background: '#e5e7eb', color: '#374151' },
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 min-h-screen bg-gray-50">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 flex items-center">
          <FaTooth className="mr-2 animate-pulse" /> Loading Dental Clinic Overview
        </h1>
        <p className="text-gray-600">Fetching data...</p>
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 flex items-center">
        <FaTooth className="mr-3 text-blue-600" /> Dental Clinic Overview
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Patients', value: stats.totalPatients, icon: <FaUserInjured className="mr-2 text-blue-500" />, color: 'border-blue-500' },
          { title: 'Total Earnings', value: `₹${stats.totalEarnings.toFixed(2)}`, icon: <FaMoneyBillWave className="mr-2 text-green-500" />, color: 'border-green-500' },
          { title: 'Total Appointments', value: stats.totalAppointments, icon: <FaCalendarCheck className="mr-2 text-purple-500" />, color: 'border-purple-500' },
          { title: 'Total Expenses', value: `₹${stats.totalExpenses.toFixed(2)}`, icon: <FaMoneyBillWave className="mr-2 text-red-500" />, color: 'border-red-500' },
        ].map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${card.color}`}
          >
            <h2 className="text-lg font-semibold text-gray-700 flex items-center">
              {card.icon} {card.title}
            </h2>
            <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Net Profit Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-md mb-8"
      >
        <h2 className="text-lg font-semibold flex items-center">
          <FaMoneyBillWave className="mr-2" /> Net Profit
        </h2>
        <p className="text-3xl font-bold mt-2">₹{(stats.totalEarnings - stats.totalExpenses).toFixed(2)}</p>
      </motion.div>

      {/* Combined Data Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FaNotesMedical className="mr-2 text-gray-600" /> Combined Data
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {combinedData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No data available</td>
                </tr>
              ) : (
                currentItems.map((item, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`hover:bg-gray-50 transition duration-200 ${item.bgColor}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.details}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {item.type === 'Patient' && (
                        <button
                          onClick={() => {
                            const patient = patients.find(p => p._id === item.patientId);
                            setSelectedPatient(patient);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Profile
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {combinedData.length > itemsPerPage && (
          <div className="flex justify-between items-center p-6 bg-gray-50">
            <div className="text-sm text-gray-600">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, combinedData.length)} of {combinedData.length} items
            </div>
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
              >
                <FaChevronLeft />
              </motion.button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page = i + 1;
                if (currentPage > 3) {
                  page = currentPage - 2 + i;
                  if (page > totalPages - 5) page = totalPages - 4 + i;
                }
                return page <= totalPages ? (
                  <motion.button
                    key={page}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => paginate(page)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {page}
                  </motion.button>
                ) : null;
              })}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
              >
                <FaChevronRight />
              </motion.button>
            </div>
          </div>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaCalendarCheck className="mr-2 text-purple-500" /> Monthly Appointments
          </h2>
          <div className="h-64">
            <Bar
              data={appointmentChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Appointments by Month' },
                },
              }}
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaMoneyBillWave className="mr-2 text-green-500" /> Monthly Earnings
          </h2>
          <div className="h-64">
            <Line
              data={earningsChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Earnings Trend' },
                },
              }}
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaMoneyBillWave className="mr-2 text-red-500" /> Monthly Expenses
          </h2>
          <div className="h-64">
            <Line
              data={expensesChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Expenses Trend' },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Download Buttons */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={downloadPDF}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300 flex items-center justify-center"
        >
          <FaFilePdf className="mr-2" /> Download PDF Report
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={downloadWord}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition duration-300 flex items-center justify-center"
        >
          <FaFileWord className="mr-2" /> Download Word Report
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchStats}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition duration-300 flex items-center justify-center"
        >
          <FaSync className="mr-2" /> Refresh Data
        </motion.button>
      </div>

      {/* Patient Profile Modal */}
      {selectedPatient && (
        <PatientProfile
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
      <Toaster position="top-right" />
    </div>
  );
};

export default Overview;
