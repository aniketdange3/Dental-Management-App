import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, paginate }) => {
  return (
    <div className="flex justify-center mt-6">
      <motion.button
        whileHover={{ scale: 1.05 }}
        disabled={currentPage === 1}
        onClick={() => paginate(currentPage - 1)}
        className="px-4 py-2 mx-1 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700 transition-all duration-200"
      >
        <FaChevronLeft />
      </motion.button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <motion.button
          key={page}
          whileHover={{ scale: 1.05 }}
          onClick={() => paginate(page)}
          className={`px-4 py-2 mx-1 ${currentPage === page ? 'bg-indigo-600' : 'bg-gray-200'} text-white rounded-lg hover:bg-indigo-500 transition-all duration-200 ${currentPage === page ? '' : 'text-gray-700'}`}
        >
          {page}
        </motion.button>
      ))}
      <motion.button
        whileHover={{ scale: 1.05 }}
        disabled={currentPage === totalPages}
        onClick={() => paginate(currentPage + 1)}
        className="px-4 py-2 mx-1 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700 transition-all duration-200"
      >
        <FaChevronRight />
      </motion.button>
    </div>
  );
};

export default Pagination;
