import { useState } from "react";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import {
  FaHome,
  FaUsers,
  FaMoneyBill,
  FaCalendar,
  FaFileAlt,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const [darkTheme, setDarkTheme] = useState(true);

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen flex flex-col transition-all duration-500 ease-in-out
        ${darkTheme ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800"} 
        ${collapsed ? "w-20" : "w-56"} shadow-lg border-r border-gray-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {!collapsed && <h1 className="text-xl font-semibold">Dashboard</h1>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-2 rounded-full hover:bg-gray-700 transition-colors ${
            darkTheme ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {collapsed ? (
            <MdKeyboardDoubleArrowRight className="text-xl" />
          ) : (
            <MdKeyboardDoubleArrowLeft className="text-xl" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <ul className="flex-1 space-y-2 px-2 py-4">
        <li>
          <Link
            to="/"
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              collapsed ? "justify-center" : ""
            } hover:bg-gray-700`}
          >
            <FaHome className="text-xl" />
            {!collapsed && <span className="text-sm font-medium">Overview</span>}
          </Link>
        </li>
        <li>
          <Link
            to="/patients"
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              collapsed ? "justify-center" : ""
            } hover:bg-gray-700`}
          >
            <FaUsers className="text-xl" />
            {!collapsed && <span className="text-sm font-medium">Patients</span>}
          </Link>
        </li>
        <li>
          <Link
            to="/expenses"
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              collapsed ? "justify-center" : ""
            } hover:bg-gray-700`}
          >
            <FaMoneyBill className="text-xl" />
            {!collapsed && <span className="text-sm font-medium">Expenses</span>}
          </Link>
        </li>
        <li>
          <Link
            to="/appointments"
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              collapsed ? "justify-center" : ""
            } hover:bg-gray-700`}
          >
            <FaCalendar className="text-xl" />
            {!collapsed && (
              <span className="text-sm font-medium">Appointments</span>
            )}
          </Link>
        </li>
        <li>
          <Link
            to="/reports"
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              collapsed ? "justify-center" : ""
            } hover:bg-gray-700`}
          >
            <FaFileAlt className="text-xl" />
            {!collapsed && <span className="text-sm font-medium">Reports</span>}
          </Link>
        </li>

        {/* Theme Toggle */}
        <div className="border-t border-gray-700">
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-3 p-3 rounded-lg w-full transition-colors ${
              collapsed ? "justify-center" : ""
            } hover:bg-gray-700`}
          >
            {darkTheme ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
            {!collapsed && (
              <span className="text-sm font-medium">
                {darkTheme ? "Light Mode" : "Dark Mode"}
              </span>
            )}
          </button>
        </div>
      </ul>
    </div>
  );
};

export default Sidebar;
