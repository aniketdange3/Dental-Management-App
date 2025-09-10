import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, paginate }) => {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-gray-200">
      <div className="text-sm text-gray-600">
        Showing {currentPage * 10 - 9} to {Math.min(currentPage * 10, totalPages * 10)} of {totalPages * 10} patients
      </div>
      <div className="flex space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 text-gray-600 rounded-md disabled:opacity-50"
        >
          <FaChevronLeft />
        </motion.button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <motion.button
            key={page}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => paginate(page)}
            className={`px-3 py-1 rounded-md ${currentPage === page ? 'bg-gray-600 text-white' : 'bg-gray-300 text-gray-600'}`}
          >
            {page}
          </motion.button>
        ))}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-300 text-gray-600 rounded-md disabled:opacity-50"
        >
          <FaChevronRight />
        </motion.button>
      </div>
    </div>
  );
};

export default Pagination;
