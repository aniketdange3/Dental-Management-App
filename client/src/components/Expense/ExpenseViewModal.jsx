import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const ExpenseViewModal = ({ isOpen, onClose, expense }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
                <Dialog.Title as="h3" className="text-xl font-semibold text-gray-800">
                  Expense Details
                </Dialog.Title>
                {expense && (
                  <div className="mt-6 space-y-4">
                    <p className="text-gray-700"><strong>Type:</strong> {expense.type}</p>
                    <p className="text-gray-700"><strong>Description:</strong> {expense.description}</p>
                    <p className="text-gray-700"><strong>Amount:</strong> ₹{expense.amount.toFixed(2)}</p>
                    <p className="text-gray-700"><strong>Date:</strong> {new Date(expense.date).toLocaleString()}</p>
                  </div>
                )}
                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ExpenseViewModal;
