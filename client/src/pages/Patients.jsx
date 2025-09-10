import { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import PatientModal from '../components/patients/PatientModal';
import PatientProfileModal from '../components/patients/PatientProfileModal';
import PatientTable from '../components/patients/PatientTable';
import Pagination from '../components/patients/Pagination';    
import { FaPlus, FaUser } from 'react-icons/fa';

const treatmentOptions = [
  'Dental Checkup',
  'Dental Cleaning',
  'Orthodontics',
  'Dental Surgery',
  'Cosmetic Dentistry',
];

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    age: '',
    address: '',
    contactDetails: '',
    city: '',
    treatment: '',
    fees: '',
    registeredDate: '',
    appointmentDate: '',
    image: null,
  });
  const [editing, setEditing] = useState(false);
  const [currentPatientId, setCurrentPatientId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/patients');
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data', {
        style: { background: '#f3f4f6', color: '#374151' },
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData((prev) => {
        const newData = { ...prev, [name]: value };
        if (name === 'dob') {
          newData.age = calculateAge(value);
        }
        return newData;
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'age') {
          formDataToSend.append(key, parseInt(formData.age, 10) || 0);
        } else if (key === 'image' && formData.image) {
          formDataToSend.append(key, formData.image);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (editing && currentPatientId) {
        await axios.put(`http://localhost:5000/api/patients/${currentPatientId}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Patient updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/patients', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Patient added successfully!');
      }
      closeModal();
      await fetchData();
    } catch (error) {
      console.error('Error saving patient:', error);
      toast.error(`Failed to ${editing ? 'update' : 'add'} patient: ${error.response?.data?.message || error.message}`);
    }
  };

  // Handle edit patient
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
      city: patient.city || '',
      treatment: patient.treatment || '',
      fees: patient.fees || '',
      registeredDate: patient.registeredDate ? new Date(patient.registeredDate).toISOString().split('T')[0] : '',
      appointmentDate: patient.appointmentDate ? new Date(patient.appointmentDate).toISOString().split('T')[0] : '',
      image: null,
    });
    setImagePreview(patient.image ? `http://localhost:5000/uploads/${patient.image}` : null);
    setIsOpen(true);
  };

  // Handle delete patient
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/patients/${id}`);
      toast.success('Patient deleted successfully!');
      await fetchData();
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast.error('Failed to delete patient');
    }
  };

  // Open modal for adding a new patient
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
      city: '',
      treatment: '',
      fees: '',
      registeredDate: '',
      appointmentDate: '',
      image: null,
    });
    setImagePreview(null);
    setIsOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsOpen(false);
    setImagePreview(null);
  };

  // Open patient profile
  const openProfile = (patient) => {
    setSelectedPatient(patient);
    setIsProfileOpen(true);
  };

  // Close patient profile
  const closeProfile = () => {
    setIsProfileOpen(false);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPatients = patients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(patients.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="container mx-auto p-6 min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-800">Patients</h1>
        <h2 className="text-xl text-gray-600 mb-6">Manage your dental clinic patients</h2>
        <p className="text-gray-600">Loading...</p>
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-indigo-700">Patients</h1>
     <div className="mb-6 flex  justify-between"> <h2 className="text-xl text-gray-600 mb-6">Manage your dental clinic patients</h2>

      {/* Add Patient Button */}
      
        <button
          onClick={openModal}
          className="p-2  text-sm gap-1 bg-indigo-700 text-white rounded-lg shadow hover:bg-gray-700 transition duration-300 flex items-center"
        >
          <FaUser className="mr-1  " /> Add Patient
        </button>
      </div>

      {/* Patient Table */}
      <PatientTable
        patients={currentPatients}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        openProfile={openProfile}
      />

      {/* Pagination */}
      {patients.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      )}

      {/* Patient Modal */}
      <PatientModal
        isOpen={isOpen}
        closeModal={closeModal}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        editing={editing}
        imagePreview={imagePreview}
        treatmentOptions={treatmentOptions}
      />

      {/* Patient Profile Modal */}
      <PatientProfileModal
        isProfileOpen={isProfileOpen}
        closeProfile={closeProfile}
        selectedPatient={selectedPatient}
      />

      <Toaster position="top-right" />
    </div>
  );
};

export default Patients;
