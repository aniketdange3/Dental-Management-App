import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt,
  FaStethoscope, FaRupeeSign, FaEdit, FaTimes, FaSave, FaTrash,
  FaMale, FaFemale, FaTransgender, FaAllergies, FaHeartbeat,
  FaTachometerAlt, FaCity, FaHome, FaNotesMedical
} from 'react-icons/fa';

const PatientProfile = ({ patient, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...patient });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/patients/${patient._id}`, formData);
      toast.success('Patient updated successfully!');
      onUpdate();
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update patient');
      console.error(error);
    }
  };

  const genderIcons = {
    Male: <FaMale className="text-blue-500" />,
    Female: <FaFemale className="text-pink-500" />,
    Other: <FaTransgender className="text-purple-500" />
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaUser className="mr-2 text-blue-600" />
            {isEditing ? 'Edit Patient' : 'Patient Profile'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition p-1"
            title="Close"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Profile Image */}
            <div className="lg:w-1/3 flex justify-center">
              <div className="w-48 h-48 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-gray-200">
                {patient.photo ? (
                  <img src={patient.photo} alt={patient.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-5xl">
                    <FaUser />
                  </div>
                )}
              </div>
            </div>

            {/* Patient Details */}
            <div className="lg:w-2/3 space-y-6">
              <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Info */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-700 border-b-2 border-blue-500 pb-2 flex items-center">
                        <FaUser className="mr-2" /> Personal Information
                      </h3>

                      <div className="space-y-3">
                        <div className="flex items-center">
                          <FaUser className="mr-2 text-gray-500" />
                          {isEditing ? (
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              className="w-full p-2 border rounded-lg"
                            />
                          ) : (
                            <span className="text-gray-800">{patient.name}</span>
                          )}
                        </div>

                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-2 text-gray-500" />
                          {isEditing ? (
                            <input
                              type="date"
                              name="dob"
                              value={formData.dob?.split('T')[0]}
                              onChange={handleChange}
                              className="w-full p-2 border rounded-lg"
                            />
                          ) : (
                            <span className="text-gray-800">
                              {new Date(patient.dob).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center">
                          <div className="mr-2 text-gray-500">
                            {genderIcons[patient.gender] || <FaTransgender />}
                          </div>
                          {isEditing ? (
                            <select
                              name="gender"
                              value={formData.gender}
                              onChange={handleChange}
                              className="w-full p-2 border rounded-lg"
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          ) : (
                            <span className="text-gray-800">{patient.gender}</span>
                          )}
                        </div>

                        <div className="flex items-center">
                          <FaPhone className="mr-2 text-gray-500" />
                          {isEditing ? (
                            <input
                              type="tel"
                              name="contactDetails"
                              value={formData.contactDetails}
                              onChange={handleChange}
                              className="w-full p-2 border rounded-lg"
                            />
                          ) : (
                            <span className="text-gray-800">{patient.contactDetails}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Medical Info */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-700 border-b-2 border-blue-500 pb-2 flex items-center">
                        <FaHeartbeat className="mr-2" /> Medical Information
                      </h3>

                      <div className="space-y-3">
                        <div className="flex items-center">
                          <FaAllergies className="mr-2 text-gray-500" />
                          {isEditing ? (
                            <input
                              type="text"
                              name="allergies"
                              value={formData.allergies || ''}
                              onChange={handleChange}
                              className="w-full p-2 border rounded-lg"
                            />
                          ) : (
                            <span className="text-gray-800">{patient.allergies || 'None'}</span>
                          )}
                        </div>

                        <div className="flex items-center">
                          <FaTachometerAlt className="mr-2 text-gray-500" />
                          {isEditing ? (
                            <input
                              type="text"
                              name="chronicDiseases"
                              value={formData.chronicDiseases || ''}
                              onChange={handleChange}
                              className="w-full p-2 border rounded-lg"
                            />
                          ) : (
                            <span className="text-gray-800">{patient.chronicDiseases || 'None'}</span>
                          )}
                        </div>

                        <div className="flex items-center">
                          <FaHeartbeat className="mr-2 text-gray-500" />
                          {isEditing ? (
                            <select
                              name="bloodType"
                              value={formData.bloodType || ''}
                              onChange={handleChange}
                              className="w-full p-2 border rounded-lg"
                            >
                              <option value="">Select Blood Type</option>
                              <option value="A+">A+</option>
                              <option value="A-">A-</option>
                              <option value="B+">B+</option>
                              <option value="B-">B-</option>
                              <option value="AB+">AB+</option>
                              <option value="AB-">AB-</option>
                              <option value="O+">O+</option>
                              <option value="O-">O-</option>
                            </select>
                          ) : (
                            <span className="text-gray-800">{patient.bloodType || 'Not specified'}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Treatment Info */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-700 border-b-2 border-blue-500 pb-2 flex items-center">
                      <FaStethoscope className="mr-2" /> Treatment Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <FaStethoscope className="mr-2 text-gray-500" />
                        {isEditing ? (
                          <select
                            name="treatment"
                            value={formData.treatment || ''}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                          >
                            <option value="">Select Treatment</option>
                            <option value="Dental Checkup">Dental Checkup</option>
                            <option value="Dental Cleaning">Dental Cleaning</option>
                            <option value="Orthodontics">Orthodontics</option>
                            <option value="Dental Surgery">Dental Surgery</option>
                            <option value="Cosmetic Dentistry">Cosmetic Dentistry</option>
                          </select>
                        ) : (
                          <span className="text-gray-800">{patient.treatment || 'N/A'}</span>
                        )}
                      </div>

                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-gray-500" />
                        {isEditing ? (
                          <input
                            type="date"
                            name="appointmentDate"
                            value={formData.appointmentDate?.split('T')[0]}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                          />
                        ) : (
                          <span className="text-gray-800">
                            {patient.appointmentDate ? new Date(patient.appointmentDate).toLocaleDateString() : 'N/A'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center mt-2">
                      <FaRupeeSign className="mr-2 text-gray-500" />
                      {isEditing ? (
                        <input
                          type="number"
                          name="fees"
                          value={formData.fees || ''}
                          onChange={handleChange}
                          className="w-full md:w-1/2 p-2 border rounded-lg"
                        />
                      ) : (
                        <span className="text-gray-800">₹{patient.fees?.toFixed(2) || '0.00'}</span>
                      )}
                    </div>
                  </div>

                  {/* Address Info */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-700 border-b-2 border-blue-500 pb-2 flex items-center">
                      <FaHome className="mr-2" /> Address Information
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-center">
                        <FaHome className="mr-2 text-gray-500" />
                        {isEditing ? (
                          <textarea
                            name="address"
                            value={formData.address || ''}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            rows="2"
                          />
                        ) : (
                          <span className="text-gray-800">{patient.address || 'N/A'}</span>
                        )}
                      </div>

                      <div className="flex items-center">
                        <FaCity className="mr-2 text-gray-500" />
                        {isEditing ? (
                          <input
                            type="text"
                            name="city"
                            value={formData.city || ''}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                          />
                        ) : (
                          <span className="text-gray-800">{patient.city || 'N/A'}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes Section */}
                <div className="space-y-4 mt-6">
                  <h3 className="text-xl font-semibold text-gray-700 border-b-2 border-blue-500 pb-2 flex items-center">
                    <FaNotesMedical className="mr-2" /> Notes
                  </h3>

                  {isEditing ? (
                    <textarea
                      name="notes"
                      value={formData.notes || ''}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg"
                      rows="3"
                      placeholder="Add any additional notes..."
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-800">{patient.notes || 'No notes available'}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                  {!isEditing ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
                    >
                      <FaEdit className="mr-2" /> Edit
                    </motion.button>
                  ) : (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center"
                      >
                        <FaTimes className="mr-2" /> Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center"
                      >
                        <FaSave className="mr-2" /> Save
                      </motion.button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PatientProfile;
