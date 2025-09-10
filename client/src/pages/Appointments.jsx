import { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import {
  FaTooth,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaIdCard,
  FaChevronLeft,
  FaChevronRight,
  FaUser,
  FaClock,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const statusOptions = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
const treatmentOptions = [
  'Dental Checkup',
  'Dental Cleaning',
  'Orthodontics',
  'Dental Surgery',
  'Cosmetic Dentistry',
];

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    patient: '',
    date: '',
    treatment: '',
    status: 'Pending',
  });
  const [editing, setEditing] = useState(false);
  const [currentAppointmentId, setCurrentAppointmentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Color palette
  const colors = {
    primary: '#3B82F6', // Blue
    secondary: '#6366F1', // Indigo
    accent: '#10B981',   // Emerald
    neutral: '#6B7280',  // Gray
    light: '#F3F4F6',    // Light gray
    white: '#FFFFFF',
    danger: '#EF4444',   // Red
    warning: '#F59E0B',  // Amber
    success: '#10B981',  // Emerald
  };

  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [patientsRes, appointmentsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/patients'),
        axios.get('http://localhost:5000/api/appointments'),
      ]);
      setPatients(patientsRes.data);
      setAppointments(appointmentsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data', {
        style: { background: colors.light, color: colors.neutral },
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patient || !formData.date || !formData.treatment) {
      toast.error('Please fill all required fields', {
        style: { background: colors.light, color: colors.neutral },
      });
      return;
    }

    const appointmentData = {
      patient: formData.patient,
      date: new Date(formData.date).toISOString(),
      treatment: formData.treatment,
      status: formData.status,
    };

    try {
      if (editing && currentAppointmentId) {
        await axios.put(`http://localhost:5000/api/appointments/${currentAppointmentId}`, appointmentData);
        toast.success('Appointment updated successfully!', {
          icon: <FaEdit className="text-gray-600" />,
          style: { background: colors.light, color: colors.neutral },
        });
      } else {
        await axios.post('http://localhost:5000/api/appointments', appointmentData);
        toast.success('Appointment added successfully!', {
          icon: <FaPlus className="text-gray-600" />,
          style: { background: colors.light, color: colors.neutral },
        });
      }
      closeModal();
      await fetchData();
    } catch (error) {
      console.error('Error saving appointment:', error);
      toast.error(`Failed to ${editing ? 'update' : 'add'} appointment: ${error.response?.data?.message || error.message}`, {
        style: { background: colors.light, color: colors.neutral },
      });
    }
  };

  const handleEdit = (appointment) => {
    setEditing(true);
    setCurrentAppointmentId(appointment._id);
    setFormData({
      patient: appointment.patient?._id || '',
      date: appointment.date ? new Date(appointment.date).toISOString().slice(0, 16) : '',
      treatment: appointment.treatment || '',
      status: appointment.status || 'Pending',
    });
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/appointments/${id}`);
      toast.success('Appointment deleted successfully!', {
        icon: <FaTrash className="text-gray-600" />,
        style: { background: colors.light, color: colors.neutral },
      });
      await fetchData();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error('Failed to delete appointment', {
        style: { background: colors.light, color: colors.neutral },
      });
    }
  };

  const openModal = () => {
    setEditing(false);
    setCurrentAppointmentId(null);
    setFormData({
      patient: '',
      date: '',
      treatment: '',
      status: 'Pending',
    });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = appointments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(appointments.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Status badge component
  const StatusBadge = ({ status }) => {
    let bgColor, icon;
    
    switch(status) {
      case 'Pending':
        bgColor = 'bg-amber-100 text-amber-800';
        icon = <FaClock className="mr-1" />;
        break;
      case 'Confirmed':
        bgColor = 'bg-blue-100 text-blue-800';
        icon = <FaCheckCircle className="mr-1" />;
        break;
      case 'Completed':
        bgColor = 'bg-green-100 text-green-800';
        icon = <FaCheckCircle className="mr-1" />;
        break;
      case 'Cancelled':
        bgColor = 'bg-red-100 text-red-800';
        icon = <FaTimesCircle className="mr-1" />;
        break;
      default:
        bgColor = 'bg-gray-100 text-gray-800';
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}>
        {icon} {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <FaTooth className="mr-2 text-indigo-600" /> Appointment Dashboard
          </h1>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FaTooth className="mr-2 text-indigo-600" /> Appointment Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Manage and track dental clinic appointments</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Appointments', value: appointments.length, icon: FaCalendarAlt, color: 'bg-blue-100 text-blue-600' },
            { label: 'Total Patients', value: patients.length, icon: FaUser, color: 'bg-green-100 text-green-600' },
            { label: 'Pending', value: appointments.filter(a => a.status === 'Pending').length, icon: FaClock, color: 'bg-amber-100 text-amber-600' },
            { label: 'Treatments', value: treatmentOptions.length, icon: FaTooth, color: 'bg-indigo-100 text-indigo-600' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-600">{stat.label}</h3>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">Appointments</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openModal}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md flex items-center hover:bg-indigo-700 transition-all duration-200"
          >
            <FaPlus className="mr-2" /> New Appointment
          </motion.button>
        </div>

        {/* Appointment Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Patient', 'Date & Time', 'Treatment', 'Status', 'Actions'].map((header) => (
                    <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <FaCalendarAlt className="text-gray-300 text-4xl mb-2" />
                        <p>No appointments scheduled yet</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentAppointments.map((appointment) => (
                    <motion.tr
                      key={appointment._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50 transition-all duration-150"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <FaUser className="text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{appointment.patient?.name || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">{appointment.patient?.email || 'No email'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(appointment.date).toLocaleDateString()} <br />
                        <span className="text-xs text-gray-400">
                          {new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.treatment}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <StatusBadge status={appointment.status} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(appointment)}
                          className="px-3 py-1 rounded bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-all duration-200"
                        >
                          <FaEdit />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(appointment._id)}
                          className="px-3 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200"
                        >
                          <FaTrash />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {appointments.length > itemsPerPage && (
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex sm:items-center sm:justify-between w-full">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(indexOfLastItem, appointments.length)}</span> of{' '}
                    <span className="font-medium">{appointments.length}</span> results
                  </p>
                </div>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-50 hover:bg-indigo-700 transition-all duration-200"
                  >
                    <FaChevronLeft />
                  </motion.button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <motion.button
                      key={page}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => paginate(page)}
                      className={`px-3 py-2 rounded-lg ${
                        currentPage === page ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                      } hover:bg-indigo-500 hover:text-white transition-all duration-200`}
                    >
                      {page}
                    </motion.button>
                  ))}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-50 hover:bg-indigo-700 transition-all duration-200"
                  >
                    <FaChevronRight />
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal */}
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-30" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl">
                    <Dialog.Title as="h3" className="text-xl font-semibold text-gray-800 flex items-center">
                      <FaTooth className="mr-2 text-indigo-600" />
                      {editing ? 'Edit Appointment' : 'New Appointment'}
                    </Dialog.Title>
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                          <FaUser className="mr-2 text-gray-500" /> Patient
                        </label>
                        <select
                          name="patient"
                          value={formData.patient}
                          onChange={handleChange}
                          className="mt-1 w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm transition-all duration-200"
                          required
                        >
                          <option value="">Select Patient</option>
                          {patients.map(patient => (
                            <option key={patient._id} value={patient._id}>{patient.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                          <FaCalendarAlt className="mr-2 text-gray-500" /> Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          className="mt-1 w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm transition-all duration-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                          <FaTooth className="mr-2 text-gray-500" /> Treatment
                        </label>
                        <select
                          name="treatment"
                          value={formData.treatment}
                          onChange={handleChange}
                          className="mt-1 w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm transition-all duration-200"
                          required
                        >
                          <option value="">Select Treatment</option>
                          {treatmentOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                          <FaIdCard className="mr-2 text-gray-500" /> Status
                        </label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="mt-1 w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm transition-all duration-200"
                          required
                        >
                          <option value="">Select Status</option>
                          {statusOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex justify-end space-x-3 mt-6">
                        <button
                          type="button"
                          onClick={closeModal}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 flex items-center"
                        >
                          <FaPlus className="mr-2" />
                          {editing ? 'Update' : 'Create'} Appointment
                        </button>
                      </div>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: colors.white,
              color: colors.neutral,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: `1px solid ${colors.light}`,
              borderRadius: '8px',
            },
          }}
        />
      </div>
    </div>
  );
};

export default Appointments;