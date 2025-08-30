import { FaHome, FaUsers, FaMoneyBill, FaCalendar, FaFileAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dental Dashboard</h1>
      </div>
      <ul>
        <li className="mb-4">
          <Link to="/" className="flex items-center">
            <FaHome className="mr-2" /> Overview
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/patients" className="flex items-center">
            <FaUsers className="mr-2" /> Patients
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/expenses" className="flex items-center">
            <FaMoneyBill className="mr-2" /> Expenses
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/appointments" className="flex items-center">
            <FaCalendar className="mr-2" /> Appointments
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/reports" className="flex items-center">
            <FaFileAlt className="mr-2" /> Reports
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
