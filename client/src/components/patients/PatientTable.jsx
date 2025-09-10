import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaEdit, 
  FaTrash, 
  FaPhone, 
  FaCalendarAlt, 
  FaStethoscope,
  FaDollarSign,
  FaMapMarkerAlt,
  FaVenusMars,
  FaClock,
  FaEye,
  FaUserMd,
  FaChevronRight,
  FaRupeeSign
} from 'react-icons/fa';
import { FiEdit3 } from "react-icons/fi";


const PatientTable = ({ patients, handleEdit, handleDelete, openProfile }) => {
  const getStatusBadge = (appointmentDate) => {
    if (!appointmentDate) return { text: 'No Appointment', color: 'bg-gray-100 text-gray-600' };
    
    const today = new Date();
    const appointment = new Date(appointmentDate);
    const diffDays = Math.ceil((appointment - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Past Due', color: 'bg-red-100 text-red-700' };
    if (diffDays === 0) return { text: 'Today', color: 'bg-green-100 text-green-700' };
    if (diffDays <= 7) return { text: 'This Week', color: 'bg-yellow-100 text-yellow-700' };
    return { text: 'Scheduled', color: 'bg-blue-100 text-blue-700' };
  };

  const getPriorityColor = (treatment) => {
    const treatmentColors = {
      'Emergency': 'bg-red-500',
      'Surgery': 'bg-orange-500',
      'Consultation': 'bg-blue-500',
      'Checkup': 'bg-green-500',
      'Follow-up': 'bg-purple-500'
    };
    return treatmentColors[treatment] || 'bg-gray-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-100">
      {/* Table Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <FaUserMd className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Patient Management</h2>
              <p className="text-blue-100 text-sm">
                {patients.length} {patients.length === 1 ? 'patient' : 'patients'} registered
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-4 text-white text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live Data</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left">
                <div className="flex items-center space-x-2">
                  <FaUser className="w-4 h-4 text-gray-500" />
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Patient Info
                  </span>
                </div>
              </th>
              <th className="px-6 py-4 text-left">
                <div className="flex items-center space-x-2">
                  <FaMapMarkerAlt className="w-4 h-4 text-gray-500" />
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Location
                  </span>
                </div>
              </th>
              <th className="px-6 py-4 text-left">
                <div className="flex items-center space-x-2">
                  <FaStethoscope className="w-4 h-4 text-gray-500" />
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Treatment
                  </span>
                </div>
              </th>
              <th className="px-6 py-4 text-left">
                <div className="flex items-center space-x-2">
                  <FaCalendarAlt className="w-4 h-4 text-gray-500" />
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Appointment
                  </span>
                </div>
              </th>
              <th className="px-6 py-4 text-left">
                <div className="flex items-center space-x-2">
                  <FaRupeeSign className="w-4 h-4 text-gray-500" />
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Fees
                  </span>
                </div>
              </th>
              <th className="px-6 py-4 text-center">
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {patients.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <FaUser className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-600">No patients found</p>
                      <p className="text-sm text-gray-400">Add your first patient to get started</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              patients.map((patient, index) => {
                const status = getStatusBadge(patient.appointmentDate);
                return (
                  <motion.tr
                    key={patient._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group cursor-pointer"
                    onClick={() => openProfile(patient)}
                  >
                    {/* Patient Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {patient.image ? (
                            <img
                              src={`http://localhost:5000/uploads/${patient.image}`}
                              alt={patient.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-300 transition-colors"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                              <FaUser className="w-6 h-6 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                            {patient.name}
                          </p>
                          <div className="flex items-center space-x-3 mt-1">
                            {patient.age && (
                              <span className="inline-flex items-center text-xs text-gray-500">
                                <FaClock className="w-3 h-3 mr-1" />
                                {patient.age}y
                              </span>
                            )}
                            {patient.gender && (
                              <span className="inline-flex items-center text-xs text-gray-500">
                                <FaVenusMars className="w-3 h-3 mr-1" />
                                {patient.gender}
                              </span>
                            )}
                            {patient.contactDetails && (
                              <span className="inline-flex items-center text-xs text-gray-500">
                                <FaPhone className="w-3 h-3 mr-1" />
                                {patient.contactDetails.slice(0, 10)}...
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">{patient.city || 'N/A'}</div>
                      {patient.address && (
                        <div className="text-xs text-gray-500 mt-1 truncate max-w-32">
                          {patient.address}
                        </div>
                      )}
                    </td>

                    {/* Treatment */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(patient.treatment)}`}></div>
                        <span className="text-sm font-medium text-gray-900">
                          {patient.treatment || 'N/A'}
                        </span>
                      </div>
                    </td>

                    {/* Appointment */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">
                          {patient.appointmentDate ? new Date(patient.appointmentDate).toLocaleDateString() : 'N/A'}
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.text}
                        </span>
                      </div>
                    </td>

                    {/* Fees */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-green-600">
                        {patient.fees ? `₹ ${patient.fees}` : 'N/A'}
                      </div>
                      {patient.fees && (
                        <div className="text-xs text-gray-500 mt-1">Treatment fee</div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-1">
                        <motion.button
                          whileHover={{ scale: 1.05, y: -1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            openProfile(patient);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 group/btn"
                          title="View Profile"
                        >
                          <FaEye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05, y: -1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(patient);
                          }}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200 group/btn"
                          title="Edit Patient"
                        >
                          <FiEdit3 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05, y: -1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(patient._id);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 group/btn"
                          title="Delete Patient"
                        >
                          <FaTrash className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        </motion.button>

                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <FaChevronRight className="w-3 h-3 text-gray-400" />
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      {patients.length > 0 && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span className="font-medium">
                Total: {patients.length} {patients.length === 1 ? 'patient' : 'patients'}
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs">Active records</span>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientTable;