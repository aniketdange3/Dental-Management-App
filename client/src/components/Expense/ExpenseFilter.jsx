// components/ExpenseFilter.jsx
import { FaFilter } from 'react-icons/fa';

const ExpenseFilter = ({ filterType, setFilterType, expenseTypes }) => {
  return (
    <div className="relative">
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm w-full sm:w-64 transition-all duration-200 appearance-none"
      >
        <option value="">All Types</option>
        {expenseTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <FaFilter className="text-gray-400" />
      </div>
    </div>
  );
};

export default ExpenseFilter;
