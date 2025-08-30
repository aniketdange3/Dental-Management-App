import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { PieChart, Pie, Cell, Legend as PieLegend, Tooltip as PieTooltip } from 'recharts';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, HeadingLevel } from 'docx';
import toast, { Toaster } from 'react-hot-toast';
import { FaTooth, FaDownload, FaChartPie } from 'react-icons/fa';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#ec4899', '#22c55e', '#f97316', '#a855f7', '#14b8a6', '#facc15'
];

const Reports = () => {
  const [patients, setPatients] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsResponse, expensesResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/patients'),
          axios.get('http://localhost:5000/api/expenses')
        ]);
        setPatients(patientsResponse.data);
        setExpenses(expensesResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch data', { icon: '❌', style: { background: '#fee2e2', color: '#b91c1c' } });
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Patient data for bar chart (months on Y-axis, patients on X-axis)
  const patientData = months.map((month, index) => ({
    month,
    patients: patients.filter(p => new Date(p.dateAdded).getMonth() === index).length
  }));

  // Find month with most patients
  const maxPatients = patientData.reduce((max, curr) => 
    curr.patients > max.patients ? curr : max, { month: 'None', patients: 0 });

  // Expense data for pie chart (by type)
  const expenseTypes = [...new Set(expenses.map(e => e.type))];
  const expenseData = expenseTypes.map(type => ({
    type,
    amount: expenses.filter(e => e.type === type).reduce((sum, e) => sum + e.amount, 0)
  }));

  // Summary metrics
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalPatients = patients.length;
  const dentalExpenses = expenses.filter(e => 
    ['Dental Checkup', 'Dental Cleaning', 'Orthodontics', 'Dental Surgery', 'Cosmetic Dentistry'].includes(e.type)
  ).reduce((sum, e) => sum + e.amount, 0);
  const dentalExpensePercentage = totalExpenses > 0 ? ((dentalExpenses / totalExpenses) * 100).toFixed(2) : 0;

  // Download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor('#1e40af');
    doc.text('🦷 Dental Clinic Summary Report', 20, 20);
    doc.setFontSize(14);
    doc.setTextColor('#1f2937');
    doc.text('Summary Metrics', 20, 30);
    doc.text(`Total Patients: ${totalPatients}`, 30, 40);
    doc.text(`Total Expenses: ₹${totalExpenses.toFixed(2)}`, 30, 50);
    doc.text(`Dental Expense %: ${dentalExpensePercentage}%`, 30, 60);
    doc.text(`Most Patients: ${maxPatients.month} (${maxPatients.patients} patients)`, 30, 70);
    
    doc.text('Patient Details', 20, 80);
    patients.forEach((p, i) => {
      doc.text(`${p.name}: ${new Date(p.dateAdded).toLocaleString()}`, 30, 90 + i * 10);
    });
    
    doc.text('Expense Details', 20, 90 + patients.length * 10 + 10);
    expenses.forEach((e, i) => {
      doc.text(`${e.type} - ${e.description}: ₹${e.amount.toFixed(2)} (${new Date(e.date).toLocaleString()})`, 30, 110 + patients.length * 10 + i * 10);
    });
    
    doc.save('Dental_Clinic_Summary_Report.pdf');
    toast.success('PDF Downloaded!', {
      icon: <FaDownload className="text-blue-600" />,
      style: { background: '#bfdbfe', color: '#1e40af' }
    });
  };

  // Download Word
  const downloadWord = async () => {
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            text: '🦷 Dental Clinic Summary Report',
            heading: HeadingLevel.HEADING_1,
            alignment: 'center',
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: 'Summary Metrics',
            heading: HeadingLevel.HEADING_2
          }),
          new Paragraph({ text: `Total Patients: ${totalPatients}` }),
          new Paragraph({ text: `Total Expenses: ₹${totalExpenses.toFixed(2)}` }),
          new Paragraph({ text: `Dental Expense %: ${dentalExpensePercentage}%` }),
          new Paragraph({ text: `Most Patients: ${maxPatients.month} (${maxPatients.patients} patients)` }),
          new Paragraph({
            text: 'Patient Details',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200 }
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Name')] }),
                  new TableCell({ children: [new Paragraph('Date Added')] })
                ]
              }),
              ...patients.map(p => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(p.name)] }),
                  new TableCell({ children: [new Paragraph(new Date(p.dateAdded).toLocaleString())] })
                ]
              }))
            ]
          }),
          new Paragraph({
            text: 'Expense Details',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200 }
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Type')] }),
                  new TableCell({ children: [new Paragraph('Description')] }),
                  new TableCell({ children: [new Paragraph('Amount (₹)')] }),
                  new TableCell({ children: [new Paragraph('Date')] })
                ]
              }),
              ...expenses.map(e => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(e.type)] }),
                  new TableCell({ children: [new Paragraph(e.description)] }),
                  new TableCell({ children: [new Paragraph(`₹${e.amount.toFixed(2)}`)] }),
                  new TableCell({ children: [new Paragraph(new Date(e.date).toLocaleString())] })
                ]
              }))
            ]
          })
        ]
      }]
    });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Dental_Clinic_Summary_Report.docx';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Word Document Downloaded!', {
      icon: <FaDownload className="text-green-600" />,
      style: { background: '#bbf7d0', color: '#15803d' }
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
        <h1 className="text-4xl font-bold text-blue-800 mb-6 flex items-center">
          <FaTooth className="mr-2" /> Dental Clinic Reports
        </h1>
        <p className="text-gray-600">Loading...</p>
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
      <h1 className="text-4xl font-bold text-blue-800 mb-6 flex items-center">
        <FaTooth className="mr-2" /> Dental Clinic Reports
      </h1>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-lg border-l-4 border-blue-600 transform hover:scale-105 transition duration-300">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <FaTooth className="mr-2 text-blue-600" /> Total Patients
          </h3>
          <p className="text-2xl font-bold text-blue-600">{totalPatients}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg border-l-4 border-green-600 transform hover:scale-105 transition duration-300">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <FaChartPie className="mr-2 text-green-600" /> Total Expenses
          </h3>
          <p className="text-2xl font-bold text-green-600">₹{totalExpenses.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg border-l-4 border-purple-600 transform hover:scale-105 transition duration-300">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <FaChartPie className="mr-2 text-purple-600" /> Dental Expense %
          </h3>
          <p className="text-2xl font-bold text-purple-600">{dentalExpensePercentage}%</p>
        </div>
      </div>

      {/* Download Buttons */}
      <div className="mb-6 flex space-x-4">
        <button
          onClick={downloadPDF}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 flex items-center"
        >
          <FaDownload className="mr-2" /> Download PDF
        </button>
        <button
          onClick={downloadWord}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 flex items-center"
        >
          <FaDownload className="mr-2" /> Download Word
        </button>
      </div>

      {/* Patient Report */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaTooth className="mr-2 text-blue-600" /> 
          Patient Report - Most Patients in {maxPatients.month} ({maxPatients.patients} patients)
        </h2>
        {patients.length === 0 ? (
          <p className="text-gray-600">No patient data available</p>
        ) : (
          <>
            <BarChart 
              width={600} 
              height={400} 
              data={patientData} 
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              className="mb-4"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#1f2937" />
              <YAxis dataKey="month" type="category" stroke="#1f2937" />
              <Tooltip formatter={(value) => `${value} patients`} />
              <Legend />
              <Bar dataKey="patients" fill="#8884d8" name="Patients" animationDuration={1000} />
            </BarChart>
            <table className="min-w-full bg-white">
              <thead className="bg-blue-100">
                <tr>
                  <th className="py-3 px-4 text-left text-blue-800 font-semibold">Name</th>
                  <th className="py-3 px-4 text-left text-blue-800 font-semibold">Date Added</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient._id} className="border-b hover:bg-blue-50 transition duration-200">
                    <td className="py-3 px-4">{patient.name}</td>
                    <td className="py-3 px-4">{new Date(patient.dateAdded).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* Expense Report */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaChartPie className="mr-2 text-green-600" /> Expense Report
        </h2>
        {expenses.length === 0 ? (
          <p className="text-gray-600">No expense data available</p>
        ) : (
          <>
            <PieChart width={600} height={300} className="mb-4">
              <Pie
                data={expenseData}
                dataKey="amount"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ type, amount }) => `${type}: ₹${amount.toFixed(2)}`}
                animationDuration={1000}
              >
                {expenseData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <PieTooltip formatter={(value) => `₹${value.toFixed(2)}`} />
              <PieLegend />
            </PieChart>
            <table className="min-w-full bg-white">
              <thead className="bg-green-100">
                <tr>
                  <th className="py-3 px-4 text-left text-green-800 font-semibold">Type</th>
                  <th className="py-3 px-4 text-left text-green-800 font-semibold">Description</th>
                  <th className="py-3 px-4 text-left text-green-800 font-semibold">Amount (₹)</th>
                  <th className="py-3 px-4 text-left text-green-800 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense._id} className="border-b hover:bg-green-50 transition duration-200">
                    <td className="py-3 px-4">{expense.type}</td>
                    <td className="py-3 px-4">{expense.description}</td>
                    <td className="py-3 px-4">{expense.amount.toFixed(2)}</td>
                    <td className="py-3 px-4">{new Date(expense.date).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default Reports;