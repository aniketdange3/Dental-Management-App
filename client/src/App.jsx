import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import Patients from './pages/Patients';
import Expenses from './pages/Expenses';
import Appointments from './pages/Appointments';
import Reports from './pages/Reports';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <div className={darkMode ? 'dark' : ''}>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 p-4 bg-gray-100 dark:bg-gray-900 dark:text-white">
            <button
              onClick={toggleDarkMode}
              className="mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
