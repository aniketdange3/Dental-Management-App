import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { Fragment, useState } from 'react';
import {
  FaTooth,
  FaCalendarAlt,
  FaIdCard,
  FaHome,
  FaPhone,
  FaImage,
  FaMoneyBillWave,
  FaPlus,
  FaUser,
} from 'react-icons/fa';

const PatientModal = ({
  isOpen,
  closeModal,
  formData,
  handleChange,
  handleSubmit,
  editing,
  imagePreview,
  treatmentOptions,
}) => {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 2));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <Transition.Root show={isOpen} as={Fragment}>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                <div className="px-6 py-6">
                  {/* Header */}
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold text-gray-800 flex items-center justify-between"
                  >
                    <span className="flex items-center">
                      <FaTooth className="mr-2 text-gray-600" />
                      {editing ? 'Edit Patient' : 'Add New Patient'}
                    </span>
                  </Dialog.Title>

                  {/* Progress Indicator */}
                  <div className="flex items-center justify-center mt-4 mb-6">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          step === 1 ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        1
                      </div>
                      <div className="w-12 h-1 bg-gray-300"></div>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          step === 2 ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        2
                      </div>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {step === 1 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Profile Image */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 flex items-center">
                            <FaImage className="mr-2 text-gray-600" /> Profile Image
                          </label>
                          <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleChange}
                            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 
                            file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold 
                            file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                          />
                          {imagePreview && (
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="mt-3 w-20 h-20 rounded-full object-cover"
                            />
                          )}
                        </div>
                        {/* Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 flex items-center">
                            <FaUser className="mr-2 text-gray-600" /> Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm 
                            focus:border-gray-500 focus:ring-gray-500"
                            required
                          />
                        </div>
                        {/* Date of Birth */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 flex items-center">
                            <FaCalendarAlt className="mr-2 text-gray-600" /> Date of Birth
                          </label>
                          <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm 
                            focus:border-gray-500 focus:ring-gray-500"
                            required
                          />
                        </div>
                        {/* Gender */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 flex items-center">
                            <FaIdCard className="mr-2 text-gray-600" /> Gender
                          </label>
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm 
                            focus:border-gray-500 focus:ring-gray-500"
                            required
                          >
                            <option value="" disabled>Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        {/* Age */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 flex items-center">
                            <FaIdCard className="mr-2 text-gray-600" /> Age
                          </label>
                          <input
                            type="number"
                            name="age"
                            value={formData.age}
                            readOnly
                            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm 
                            bg-gray-100 cursor-not-allowed"
                          />
                        </div>
                        {/* Address */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 flex items-center">
                            <FaHome className="mr-2 text-gray-600" /> Address
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm 
                            focus:border-gray-500 focus:ring-gray-500"
                            required
                          />
                        </div>
                        {/* City */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 flex items-center">
                            <FaHome className="mr-2 text-gray-600" /> City
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm 
                            focus:border-gray-500 focus:ring-gray-500"
                            required
                          />
                        </div>
                        {/* Contact */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 flex items-center">
                            <FaPhone className="mr-2 text-gray-600" /> Contact
                          </label>
                          <input
                            type="text"
                            name="contactDetails"
                            value={formData.contactDetails}
                            onChange={handleChange}
                            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm 
                            focus:border-gray-500 focus:ring-gray-500"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Treatment */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 flex items-center">
                            <FaTooth className="mr-2 text-gray-600" /> Treatment
                          </label>
                          <select
                            name="treatment"
                            value={formData.treatment}
                            onChange={handleChange}
                            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm 
                            focus:border-gray-500 focus:ring-gray-500"
                            required
                          >
                            <option value="" disabled>Select Treatment</option>
                            {treatmentOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                        {/* Fees with ₹ */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 flex items-center">
                            <FaMoneyBillWave className="mr-2 text-gray-600" /> Fees (₹)
                          </label>
                          <input
                            type="number"
                            name="fees"
                            value={formData.fees}
                            onChange={handleChange}
                            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm 
                            focus:border-gray-500 focus:ring-gray-500"
                            required
                          />
                        </div>
                        {/* Registered Date */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 flex items-center">
                            <FaCalendarAlt className="mr-2 text-gray-600" /> Registered Date
                          </label>
                          <input
                            type="date"
                            name="registeredDate"
                            value={formData.registeredDate}
                            onChange={handleChange}
                            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm 
                            focus:border-gray-500 focus:ring-gray-500"
                            required
                          />
                        </div>
                        {/* Appointment Date */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 flex items-center">
                            <FaCalendarAlt className="mr-2 text-gray-600" /> Appointment Date
                          </label>
                          <input
                            type="date"
                            name="appointmentDate"
                            value={formData.appointmentDate}
                            onChange={handleChange}
                            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm 
                            focus:border-gray-500 focus:ring-gray-500"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-between mt-6">
                      {step > 1 ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={prevStep}
                          className="px-4 py-2 border border-gray-300 rounded-md 
                          text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Back
                        </motion.button>
                      ) : (
                        <span />
                      )}

                      {step < 2 ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={nextStep}
                          className="px-4 py-2 bg-gray-600 text-white rounded-md 
                          text-sm font-medium hover:bg-gray-700"
                        >
                          Next
                        </motion.button>
                      ) : (
                        <div className="flex space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 border border-gray-300 rounded-md 
                            text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Cancel
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="px-4 py-2 bg-gray-600 text-white rounded-md 
                            text-sm font-medium hover:bg-gray-700 flex items-center"
                          >
                            <FaPlus className="mr-2" />
                            {editing ? 'Update Patient' : 'Add Patient'}
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default PatientModal;
