// components/ExpenseActions.jsx
import { motion } from 'framer-motion';
import {
  FaPlus,
  FaFilePdf,
  FaFileExcel,
  FaSearch,
} from 'react-icons/fa';


const ExpenseActions = ({ onAdd, onExportPDF, onExportCSV }) => {
  return (
    <div className="flex space-x-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAdd}
        className="p-2.5 bg-indigo-600 text-white rounded-lg shadow-md flex items-center justify-center hover:bg-indigo-700 transition-all duration-200"
        title="Add Expense"
      >
        <FaPlus />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onExportPDF}
        className="p-2.5 bg-red-600 text-white rounded-lg shadow-md flex items-center justify-center hover:bg-red-700 transition-all duration-200"
        title="Export to PDF"
      >
        <FaFilePdf />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onExportCSV}
        className="p-2.5 bg-green-600 text-white rounded-lg shadow-md flex items-center justify-center hover:bg-green-700 transition-all duration-200"
        title="Export to CSV"
      >
        <FaFileExcel />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-2.5 bg-gray-200 text-gray-700 rounded-lg shadow-md flex items-center justify-center hover:bg-gray-300 transition-all duration-200"
        title="Search"
      >
        <FaSearch />
      </motion.button>
    </div>
  );
};

export default ExpenseActions;
