import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  FaUser, 
  FaCalendarAlt, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaDollarSign, 
  FaStethoscope,
  FaTimes,
  FaBirthdayCake,
  FaVenusMars,
  FaHome,
  FaCity
} from 'react-icons/fa';

const PatientProfileModal = ({ isProfileOpen, closeProfile, selectedPatient }) => {
  const InfoCard = ({ icon: Icon, label, value, colorClass = "text-blue-600" }) => (
    <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300 hover:scale-105">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-full bg-gradient-to-r ${colorClass === 'text-blue-600' ? 'from-blue-100 to-blue-50' : 
                         colorClass === 'text-green-600' ? 'from-green-100 to-green-50' :
                         colorClass === 'text-purple-600' ? 'from-purple-100 to-purple-50' :
                         colorClass === 'text-orange-600' ? 'from-orange-100 to-orange-50' :
                         'from-gray-100 to-gray-50'}`}>
          <Icon className={`w-4 h-4 ${colorClass}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
          <p className="text-sm font-semibold text-gray-900 truncate">{value || 'N/A'}</p>
        </div>
      </div>
    </div>
  );

  return (
    <Transition.Root show={isProfileOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeProfile}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all sm:w-full sm:max-w-4xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 px-6 py-6 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-black opacity-10"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-white bg-opacity-20 rounded-full backdrop-blur-sm">
                        <FaUser className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <Dialog.Title as="h2" className="text-2xl font-bold">
                          Patient Profile
                        </Dialog.Title>
                        <p className="text-blue-100 mt-1">Complete medical information</p>
                      </div>
                    </div>
                    <button
                      onClick={closeProfile}
                      className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
                    >
                      <FaTimes className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {/* Profile Section */}
                  <div className="flex flex-col lg:flex-row gap-8 mb-8">
                    {/* Profile Image */}
                    <div className="flex-shrink-0 flex justify-center lg:justify-start">
                      <div className="relative">
                        {selectedPatient?.image ? (
                          <img
                            src={`http://localhost:5000/uploads/${selectedPatient.image}`}
                            alt={selectedPatient.name}
                            className="w-32 h-32 rounded-2xl object-cover shadow-lg border-4 border-white"
                          />
                        ) : (
                          <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shadow-lg border-4 border-white">
                            <FaUser className="w-12 h-12 text-gray-500" />
                          </div>
                        )}
                        <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* Patient Name and Basic Info */}
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {selectedPatient?.name || 'Unknown Patient'}
                      </h1>
                      <div className="flex flex-wrap gap-3 mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <FaStethoscope className="w-3 h-3 mr-1" />
                          Active Patient
                        </span>
                        {selectedPatient?.treatment && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {selectedPatient.treatment}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="text-center sm:text-left">
                          <p className="text-2xl font-bold text-gray-900">{selectedPatient?.age || 'N/A'}</p>
                          <p className="text-sm text-gray-600">Years Old</p>
                        </div>
                        <div className="text-center sm:text-left">
                          <p className="text-2xl font-bold text-gray-900">{selectedPatient?.gender || 'N/A'}</p>
                          <p className="text-sm text-gray-600">Gender</p>
                        </div>
                        <div className="text-center sm:text-left">
                          <p className="text-2xl font-bold text-green-600">₹{selectedPatient?.fees || '0'}</p>
                          <p className="text-sm text-gray-600">Treatment Fees</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Information Grid */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full mr-3"></div>
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <InfoCard 
                          icon={FaBirthdayCake} 
                          label="Date of Birth" 
                          value={selectedPatient?.dob ? new Date(selectedPatient.dob).toLocaleDateString() : null}
                          colorClass="text-purple-600"
                        />
                        <InfoCard 
                          icon={FaVenusMars} 
                          label="Gender" 
                          value={selectedPatient?.gender}
                          colorClass="text-blue-600"
                        />
                        <InfoCard 
                          icon={FaPhone} 
                          label="Contact Details" 
                          value={selectedPatient?.contactDetails}
                          colorClass="text-green-600"
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <div className="w-1 h-6 bg-gradient-to-b from-green-600 to-blue-600 rounded-full mr-3"></div>
                        Address Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoCard 
                          icon={FaHome} 
                          label="Address" 
                          value={selectedPatient?.address}
                          colorClass="text-orange-600"
                        />
                        <InfoCard 
                          icon={FaCity} 
                          label="City" 
                          value={selectedPatient?.city}
                          colorClass="text-blue-600"
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <div className="w-1 h-6 bg-gradient-to-b from-orange-600 to-red-600 rounded-full mr-3"></div>
                        Medical & Appointment Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <InfoCard 
                          icon={FaStethoscope} 
                          label="Treatment" 
                          value={selectedPatient?.treatment}
                          colorClass="text-green-600"
                        />
                        <InfoCard 
                          icon={FaDollarSign} 
                          label="Fees" 
                          value={selectedPatient?.fees ? `$${selectedPatient.fees}` : null}
                          colorClass="text-green-600"
                        />
                        <InfoCard 
                          icon={FaCalendarAlt} 
                          label="Registered Date" 
                          value={selectedPatient?.registeredDate ? new Date(selectedPatient.registeredDate).toLocaleDateString() : null}
                          colorClass="text-purple-600"
                        />
                        <InfoCard 
                          icon={FaCalendarAlt} 
                          label="Next Appointment" 
                          value={selectedPatient?.appointmentDate ? new Date(selectedPatient.appointmentDate).toLocaleDateString() : null}
                          colorClass="text-orange-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end">
                  <button
                    type="button"
                    onClick={closeProfile}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    Close Profile
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default PatientProfileModal;