import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Overview from "./pages/Overview";
import Patients from "./pages/Patients";
import Expenses from "./pages/Expenses";
import Appointments from "./pages/Appointments";
import Reports from "./pages/Reports";
import Sidebar from "./components/Sidebar";
import { useState } from "react";

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Content area */}
        <div
          className={`flex-1  bg-gray-100 transition-all duration-300 ${
            collapsed ? "ml-20" : "ml-56"
          }`}
        >
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
