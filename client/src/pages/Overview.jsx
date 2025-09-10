import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import SummaryCards from '../components/Overview/SummaryCards';
import ChartsSection from '../components/Overview/ChartsSection';
import PatientsTable from '../components/Overview/PatientsTable';
import ExpensesTable from '../components/Overview/ExpensesTable';
import DownloadSection from '../components/Overview/DownloadSection';
import Filters from '../components/Overview/Filters';
import PatientProfile from '../components/Overview/PatientProfile';
import ExpenseModal from '../components/Overview/ExpenseModal';
import { FaTooth } from 'react-icons/fa';

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
  const [currentPatientPage, setCurrentPatientPage] = useState(1);
  const [currentExpensePage, setCurrentExpensePage] = useState(1);
  const [patientsPerPage] = useState(5);
  const [expensesPerPage] = useState(5);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [isNewExpense, setIsNewExpense] = useState(false);
  const [timeRange, setTimeRange] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [patientsRes, appointmentsRes, expensesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/patients'),
        axios.get('http://localhost:5000/api/appointments'),
        axios.get('http://localhost:5000/api/expenses'),
      ]);

      const totalEarnings = appointmentsRes.data.reduce((sum, appt) => sum + (appt.fee || 500), 0);
      const totalExpenses = expensesRes.data.reduce((sum, exp) => sum + exp.amount, 0);

      setStats({
        totalPatients: patientsRes.data.length,
        totalEarnings,
        totalAppointments: appointmentsRes.data.length,
        totalExpenses,
      });

      setPatients(patientsRes.data);
      setAppointments(appointmentsRes.data);
      setExpenses(expensesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter data based on time range and search term
  const filterByTimeRange = (data, dateField) => {
    const now = new Date();
    return data.filter(item => {
      const matchesSearch =
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.treatment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase());

      const itemDate = new Date(item[dateField]);
      if (timeRange === 'week') {
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        return matchesSearch && itemDate >= weekAgo;
      } else if (timeRange === 'month') {
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        return matchesSearch && itemDate >= monthAgo;
      } else if (timeRange === 'year') {
        const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
        return matchesSearch && itemDate >= yearAgo;
      }
      return matchesSearch;
    });
  };

  const filteredPatients = filterByTimeRange(patients, 'registrationDate');
  const filteredExpenses = filterByTimeRange(expenses, 'date');
  const filteredAppointments = filterByTimeRange(appointments, 'date');

  // CRUD operations
  const handleUpdatePatient = () => fetchData();
  const handleDeletePatient = (id) => setPatients(prev => prev.filter(p => p._id !== id));
  const handleUpdateExpense = () => {
    fetchData();
    setShowExpenseModal(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
          <FaTooth className="mr-3 text-blue-600" /> Dental Clinic Overview
        </h1>
        <p className="text-gray-600">Comprehensive dashboard for your dental practice</p>
      </motion.div>

      <Filters
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onRefresh={fetchData}
      />

      <SummaryCards stats={stats} />

      <ChartsSection
        appointments={filteredAppointments}
        expenses={filteredExpenses}
      />

      <PatientsTable
        patients={filteredPatients}
        currentPage={currentPatientPage}
        itemsPerPage={patientsPerPage}
        onPageChange={setCurrentPatientPage}
        onViewPatient={setSelectedPatient}
      />

      <ExpensesTable
        expenses={filteredExpenses}
        currentPage={currentExpensePage}
        itemsPerPage={expensesPerPage}
        onPageChange={setCurrentExpensePage}
        onEditExpense={(expense) => {
          setSelectedExpense(expense);
          setIsNewExpense(false);
          setShowExpenseModal(true);
        }}
        onAddExpense={() => {
          setIsNewExpense(true);
          setShowExpenseModal(true);
        }}
      />

      <DownloadSection
        stats={stats}
        patients={filteredPatients}
        expenses={filteredExpenses}
      />

      {selectedPatient && (
        <PatientProfile
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onUpdate={handleUpdatePatient}
          onDelete={handleDeletePatient}
        />
      )}

      {showExpenseModal && (
        <ExpenseModal
          expense={isNewExpense ? null : selectedExpense}
          onClose={() => {
            setShowExpenseModal(false);
            setSelectedExpense(null);
          }}
          onUpdate={handleUpdateExpense}
          isNew={isNewExpense}
        />
      )}

      <Toaster position="top-right" />
    </div>
  );
};

export default Overview;
