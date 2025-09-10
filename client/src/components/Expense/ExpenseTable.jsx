// components/ExpenseTable.jsx
import { FaEye, FaEdit, FaTrash, FaRupeeSign, FaCalendarAlt, FaTag, FaMapMarkerAlt } from 'react-icons/fa';
import { BiSolidCategoryAlt } from "react-icons/bi";


const ExpenseTable = ({ expenses, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center text-sm font-medium text-gray-700 uppercase">
          <FaTag className="mr-1" /> Expense Info
        </div>
     
        <div className="flex items-center text-sm   font-medium text-gray-700  uppercase">
          <BiSolidCategoryAlt className="mr-1" /> Category
        </div>
        <div className="flex items-center text-sm   font-medium  text-gray-700 uppercase">
          <FaCalendarAlt className="mr-1" /> Date
        </div>
        <div className="flex items-center text-sm   font-medium text-gray-700  uppercase">
          <FaRupeeSign className="mr-1" /> Amount
        </div>
        <div className="text-center text-sm   font-medium text-gray-700 uppercase">
          Actions
        </div>
      </div>

      {/* Table Rows (Expense Cards) */}
      {expenses.map((expense) => (
        <div
          key={expense._id}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
        >
          {/* Expense Info */}
          <div className="flex items-center">
            <div className="w-6 h-6  rounded-full bg-indigo-100 flex items-center justify-center mr-3">
              <FaTag className="text-indigo-600 text-sm" />
            </div>
            <div>
              <h3 className="font-normal text-gray-500">{expense.description}</h3>
            </div>
          </div>

  
          {/* Category */}
          <div className="flex items-center">
            <BiSolidCategoryAlt className="mr-2 text-gray-400 text-lg" />
            <p className="font-normal text-gray-500">{expense.type || 'General'}</p>
          </div>

          {/* Date */}
          <div className="flex flex-col">
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2 text-gray-400 text-lg" />
              <p className="font-normal text-gray-500">
                {new Date(expense.date).toLocaleDateString()}
              </p>
            </div>
            <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full mt-1 ml-7 ${
              expense.isToday ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {expense.isToday ? 'Today' : 'This Week'}
            </span>
          </div>

          {/* Amount */}
          <div className="flex items-center">
            <div>
              <p className="font-semibold text-green-600">₹ {expense.amount.toFixed(2)}</p>
              <p className="text-gray-500 text-xs">Expense amount</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-3">
            <button
              onClick={() => onView(expense)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              title="View"
            >
              <FaEye className="text-lg" />
            </button>
            <button
              onClick={() => onEdit(expense)}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
              title="Edit"
            >
              <FaEdit className="text-lg" />
            </button>
            <button
              onClick={() => onDelete(expense._id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Delete"
            >
              <FaTrash className="text-lg" />
            </button>
          </div>
        </div>
      ))}

      {/* Footer */}
      {expenses.length > 0 && (
        <div className="p-4 bg-gray-50 text-sm text-gray-600 flex justify-between items-center">
          <div>
            <span className="font-medium">Total: {expenses.length} expenses</span>
            <span className="ml-2 inline-flex items-center text-green-500 text-xs">
              ● Active records
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTable;
