// components/ExpenseHeader.jsx
import { FaChartLine } from 'react-icons/fa';

const ExpenseHeader = ({ totalExpenses }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="p-2 bg-white/20 rounded-lg mr-3">
            <FaChartLine className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Expense Management</h2>
            <p className="text-sm opacity-90">{totalExpenses} expenses registered</p>
          </div>
        </div>
        <div className="flex items-center text-sm">
          <span className="mr-2">●</span>
          <span>Live Data</span>
        </div>
      </div>
    </div>
  );
};

export default ExpenseHeader;
