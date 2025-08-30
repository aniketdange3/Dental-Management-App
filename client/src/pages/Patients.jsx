import { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import {
  FaTooth,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCalendarAlt,
  FaIdCard,
  FaHome,
  FaPhone,
  FaDownload,
} from 'react-icons/fa';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, HeadingLevel } from 'docx';
import toast, { Toaster } from 'react-hot-toast';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement);

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const expenseTypes = [
  'Groceries', 'Rent', 'Utilities', 'Transport', 'Entertainment', 'Other',
  'Dental Checkup', 'Dental Cleaning', 'Orthodontics', 'Dental Surgery', 'Cosmetic Dentistry'
];

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    age: '',
    address: '',
    contactDetails: '',
  });
  const [editing, setEditing] = useState(false);
  const [currentPatientId, setCurrentPatientId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount and after updates
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [patientsRes, expensesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/patients'),
        axios.get('http://localhost:5000/api/expenses'),
      ]);
      setPatients(patientsRes.data);
      setExpenses(expensesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data', {
        style: { background: '#fee2e2', color: '#b91c1c' },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        age: parseInt(formData.age, 10), // Ensure age is a number
      };
      if (editing && currentPatientId) {
        await axios.put(`http://localhost:5000/api/patients/${currentPatientId}`, payload);
        toast.success('Patient updated successfully!', {
          icon: <FaEdit className="text-blue-600" />,
          style: { background: '#bfdbfe', color: '#1e40af' },
        });
      } else {
        await axios.post('http://localhost:5000/api/patients', payload);
        toast.success('Patient added successfully!', {
          icon: <FaPlus className="text-green-600" />,
          style: { background: '#bbf7d0', color: '#15803d' },
        });
      }
      closeModal();
      await fetchData();
    } catch (error) {
      console.error('Error saving patient:', error);
      toast.error(`Failed to ${editing ? 'update' : 'add'} patient: ${error.response?.data?.message || error.message}`, {
        style: { background: '#fee2e2', color: '#b91c1c' },
      });
    }
  };

  const handleEdit = (patient) => {
    setEditing(true);
    setCurrentPatientId(patient._id);
    setFormData({
      name: patient.name || '',
      dob: patient.dob ? new Date(patient.dob).toISOString().split('T')[0] : '',
      gender: patient.gender || '',
      age: patient.age?.toString() || '',
      address: patient.address || '',
      contactDetails: patient.contactDetails || '',
    });
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/patients/${id}`);
      toast.success('Patient deleted successfully!', {
        icon: <FaTrash className="text-red-600" />,
        style: { background: '#fee2e2', color: '#b91c1c' },
      });
      await fetchData();
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast.error('Failed to delete patient', {
        style: { background: '#fee2e2', color: '#b91c1c' },
      });
    }
  };

  const openModal = () => {
    setEditing(false);
    setCurrentPatientId(null);
    setFormData({
      name: '',
      dob: '',
      gender: '',
      age: '',
      address: '',
      contactDetails: '',
    });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditing(false);
    setCurrentPatientId(null);
    setFormData({
      name: '',
      dob: '',
      gender: '',
      age: '',
      address: '',
      contactDetails: '',
    });
  };

  // Patient Bar Chart Data
  const patientData = {
    labels: months,
    datasets: [{
      label: 'Patients',
      data: months.map((_, index) =>
        patients.filter(p => new Date(p.createdAt).getMonth() === index).length
      ),
      backgroundColor: 'rgba(59, 130, 246, 0.6)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1,
    }],
  };

  // Expense Pie Chart Data
  const expenseData = {
    labels: expenseTypes,
    datasets: [{
      label: 'Expenses (₹)',
      data: expenseTypes.map(type =>
        expenses.filter(exp => exp.type === type).reduce((sum, exp) => sum + exp.amount, 0)
      ),
      backgroundColor: [
        'rgba(59, 130, 246, 0.6)', 'rgba(239, 68, 68, 0.6)', 'rgba(16, 185, 129, 0.6)',
        'rgba(245, 158, 11, 0.6)', 'rgba(139, 92, 246, 0.6)', 'rgba(236, 72, 153, 0.6)',
        'rgba(34, 197, 94, 0.6)', 'rgba(249, 115, 22, 0.6)', 'rgba(168, 85, 247, 0.6)',
        'rgba(20, 184, 166, 0.6)', 'rgba(250, 204, 21, 0.6)',
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)', 'rgba(239, 68, 68, 1)', 'rgba(16, 185, 129, 1)',
        'rgba(245, 158, 11, 1)', 'rgba(139, 92, 246, 1)', 'rgba(236, 72, 153, 1)',
        'rgba(34, 197, 94, 1)', 'rgba(249, 115, 22, 1)', 'rgba(168, 85, 247, 1)',
        'rgba(20, 184, 166, 1)', 'rgba(250, 204, 21, 1)',
      ],
      borderWidth: 1,
    }],
  };

  // Download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor('#1e40af');
    doc.text('🦷 Dental Clinic Report', 20, 20);
    doc.setFontSize(14);
    doc.setTextColor('#1f2937');
    doc.text('Patient Details', 20, 30);
    patients.forEach((p, i) => {
      doc.text(
        `${p.name} - DOB: ${new Date(p.dob).toLocaleDateString()}, Gender: ${p.gender}, Age: ${p.age}, Address: ${p.address}, Contact: ${p.contactDetails}`,
        30,
        40 + i * 10
      );
    });
    doc.text('Expense Details', 20, 40 + patients.length * 10 + 10);
    expenses.forEach((e, i) => {
      doc.text(
        `${e.type} - ${e.description}: ₹${e.amount.toFixed(2)} (${new Date(e.date).toLocaleString()})`,
        30,
        60 + patients.length * 10 + i * 10
      );
    });
    doc.save('Dental_Clinic_Report.pdf');
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
            text: '🦷 Dental Clinic Report',
            heading: HeadingLevel.HEADING_1,
            alignment: 'center',
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'Patient Details',
            heading: HeadingLevel.HEADING_2,
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Name')] }),
                  new TableCell({ children: [new Paragraph('DOB')] }),
                  new TableCell({ children: [new Paragraph('Gender')] }),
                  new TableCell({ children: [new Paragraph('Age')] }),
                  new TableCell({ children: [new Paragraph('Address')] }),
                  new TableCell({ children: [new Paragraph('Contact')] }),
                ],
              }),
              ...patients.map(p => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(p.name || '')] }),
                  new TableCell({ children: [new Paragraph(new Date(p.dob).toLocaleDateString())] }),
                  new TableCell({ children: [new Paragraph(p.gender || '')] }),
                  new TableCell({ children: [new Paragraph(p.age?.toString() || '')] }),
                  new TableCell({ children: [new Paragraph(p.address || '')] }),
                  new TableCell({ children: [new Paragraph(p.contactDetails || '')] }),
                ],
              })),
            ],
          }),
          new Paragraph({
            text: 'Expense Details',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200 },
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
              ...expenses.map(e => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(e.type || '')] }),
                  new TableCell({ children: [new Paragraph(e.description || '')] }),
                  new TableCell({ children: [new Paragraph(`₹${e.amount?.toFixed(2) || '0.00'}`)] }),
                  new TableCell({ children: [new Paragraph(new Date(e.date).toLocaleString())] }),
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
    link.download = 'Dental_Clinic_Report.docx';
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
          <FaTooth className="mr-2 text-4xl animate-spin" /> Dental Patients
        </h1>
        <p className="text-gray-600">Loading...</p>
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
      <h1 className="text-4xl font-bold text-blue-800 mb-6 flex items-center">
        <FaTooth className="mr-2 text-4xl" /> Dental Patients
      </h1>

      {/* Action Buttons */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openModal}
          className="mb-4 sm:mb-0 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300 flex items-center"
        >
          <FaPlus className="mr-2" /> Add Patient
        </motion.button>
        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadPDF}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 flex items-center"
          >
            <FaDownload className="mr-2" /> Download PDF
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadWord}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 flex items-center"
          >
            <FaDownload className="mr-2" /> Download Word
          </motion.button>
        </div>
      </div>

      {/* Patient Bar Chart */}
      {patients.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-600" /> Patients by Month
          </h2>
          <Bar
            data={patientData}
            options={{
              indexAxis: 'y',
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                  labels: { color: '#1f2937', font: { size: 14 } },
                },
                title: {
                  display: true,
                  text: 'Patients Added by Month',
                  color: '#1f2937',
                  font: { size: 18, weight: 'bold' },
                },
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.dataset.label}: ${context.raw}`,
                  },
                },
              },
              scales: {
                x: {
                  grid: { display: false },
                  ticks: { color: '#1f2937' },
                  title: { display: true, text: 'Number of Patients', color: '#1f2937' },
                },
                y: {
                  grid: { color: 'rgba(209, 213, 219, 0.3)' },
                  ticks: { color: '#1f2937' },
                },
              },
            }}
          />
        </div>
      )}

      {/* Patient Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">DOB</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Gender</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Age</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-600">No patients found</td>
              </tr>
            ) : (
              patients.map((patient) => (
                <motion.tr
                  key={patient._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-blue-50 transition duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(patient.dob).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.gender}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.age}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.contactDetails}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(patient)}
                      className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                    >
                      <FaEdit className="mr-1" /> Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(patient._id)}
                      className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                      <FaTrash className="mr-1" /> Delete
                    </motion.button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Expense Pie Chart */}
      {expenses.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaIdCard className="mr-2 text-green-600" /> Expense Overview
          </h2>
          <Pie
            data={expenseData}
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
            }}
          />
        </div>
      )}

      {/* Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>
          <div className="min-h-screen px-4 text-center">
            <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title as="h3" className="text-lg font-medium text-gray-900 flex items-center">
                  <FaTooth className="mr-2 text-blue-600" />
                  {editing ? 'Edit Patient' : 'Add New Patient'}
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 flex items-center">
                      <FaTooth className="mr-2 text-blue-600" /> Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 flex items-center">
                      <FaCalendarAlt className="mr-2 text-blue-600" /> Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 flex items-center">
                      <FaIdCard className="mr-2 text-blue-600" /> Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="" disabled>Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 flex items-center">
                      <FaIdCard className="mr-2 text-blue-600" /> Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 flex items-center">
                      <FaHome className="mr-2 text-blue-600" /> Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 flex items-center">
                      <FaPhone className="mr-2 text-blue-600" /> Contact Details
                    </label>
                    <input
                      type="text"
                      name="contactDetails"
                      value={formData.contactDetails}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                    >
                      <FaPlus className="mr-2" />
                      {editing ? 'Update Patient' : 'Add Patient'}
                    </motion.button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
      <Toaster position="top-right" />
    </div>
  );
};

export default Patients;