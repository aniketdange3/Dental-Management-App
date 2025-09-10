import { useRef, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { FaChartBar, FaChartPie, FaDownload } from 'react-icons/fa';
import { Chart as ChartJS } from 'chart.js/auto';

const COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
];

const ChartsSection = ({ appointments, expenses }) => {
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);

  // Clean up charts on unmount
  useEffect(() => {
    return () => {
      if (barChartRef.current) {
        barChartRef.current.destroy();
      }
      if (pieChartRef.current) {
        pieChartRef.current.destroy();
      }
    };
  }, []);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Appointment Chart Data
  const appointmentChartData = {
    labels: months,
    datasets: [{
      label: 'Appointments',
      data: months.map((_, index) =>
        appointments.filter(a => new Date(a.date).getMonth() === index).length
      ),
      backgroundColor: COLORS[0],
      borderColor: COLORS[0],
      borderWidth: 1,
      borderRadius: 4,
    }],
  };

  // Expense Chart Data
  const categoryTotals = expenses.reduce((acc, exp) => {
    const category = exp.category || 'General';
    acc[category] = (acc[category] || 0) + exp.amount;
    return acc;
  }, {});

  const expensePieData = {
    labels: Object.keys(categoryTotals),
    datasets: [{
      data: Object.values(categoryTotals),
      backgroundColor: COLORS,
      borderWidth: 1,
    }],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Monthly Appointments Bar Chart */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <FaChartBar className="mr-2 text-blue-500" /> Monthly Appointments
          </h2>
          <button className="p-2 text-gray-500 hover:text-blue-500">
            <FaDownload />
          </button>
        </div>
        <div className="h-72">
          <Bar
            ref={(el) => { barChartRef.current = el?.chartInstance }}
            data={appointmentChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                title: { display: false },
              },
              scales: {
                y: { beginAtZero: true },
              },
            }}
          />
        </div>
      </motion.div>

      {/* Expense Distribution Pie Chart */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <FaChartPie className="mr-2 text-green-500" /> Expense Distribution
          </h2>
          <button className="p-2 text-gray-500 hover:text-green-500">
            <FaDownload />
          </button>
        </div>
        <div className="h-72">
          <Pie
            ref={(el) => { pieChartRef.current = el?.chartInstance }}
            data={expensePieData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'right' },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const label = context.label || '';
                      const value = context.raw || 0;
                      const total = context.dataset.data.reduce((a, b) => a + b, 0);
                      const percentage = Math.round((value / total) * 100);
                      return `${label}: ₹${value.toLocaleString()} (${percentage}%)`;
                    }
                  }
                }
              },
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ChartsSection;
