import { motion } from 'framer-motion';
import { FaUserInjured, FaMoneyBillWave, FaCalendarCheck, FaFileInvoiceDollar } from 'react-icons/fa';

const SummaryCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: <FaUserInjured className="text-2xl text-blue-500" />,
      color: 'border-blue-500',
    },
    {
      title: 'Total Earnings',
      value: `₹${stats.totalEarnings.toFixed(2)}`,
      icon: <FaMoneyBillWave className="text-2xl text-green-500" />,
      color: 'border-green-500',
    },
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      icon: <FaCalendarCheck className="text-2xl text-purple-500" />,
      color: 'border-purple-500',
    },
    {
      title: 'Total Expenses',
      value: `₹${stats.totalExpenses.toFixed(2)}`,
      icon: <FaFileInvoiceDollar className="text-2xl text-red-500" />,
      color: 'border-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${card.color}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
              <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-50">
              {card.icon}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SummaryCards;
