

import { motion } from 'framer-motion';
import { FaFilePdf, FaFileWord, FaDownload } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, HeadingLevel } from 'docx';

const DownloadSection = ({ stats, patients, expenses }) => {
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Dental Clinic Overview', 20, 20);
    doc.setFontSize(14);

    // Summary stats
    doc.text('Summary Statistics', 20, 30);
    doc.text(`Total Patients: ${stats.totalPatients}`, 30, 40);
    doc.text(`Total Earnings: ₹${stats.totalEarnings.toFixed(2)}`, 30, 50);
    doc.text(`Total Appointments: ${stats.totalAppointments}`, 30, 60);
    doc.text(`Total Expenses: ₹${stats.totalExpenses.toFixed(2)}`, 30, 70);
    doc.text(`Net Profit: ₹${(stats.totalEarnings - stats.totalExpenses).toFixed(2)}`, 30, 80);

    // Patients table
    doc.text('Patients', 20, 100);
    let yOffset = 110;
    patients.slice(0, 10).forEach((patient, i) => {
      if (yOffset > 250) {
        doc.addPage();
        yOffset = 20;
        doc.text('Patients (continued)', 20, yOffset);
        yOffset += 10;
      }
      doc.text(
        `${patient.name} | ${patient.treatment || 'N/A'} | ${new Date(patient.registrationDate).toLocaleDateString()} | ${patient.contactDetails || 'N/A'}`,
        20, yOffset + (i * 10)
      );
      yOffset += 10;
    });

    // Expenses table
    yOffset += 20;
    doc.text('Expenses', 20, yOffset);
    yOffset += 10;
    expenses.slice(0, 10).forEach((expense, i) => {
      if (yOffset > 250) {
        doc.addPage();
        yOffset = 20;
        doc.text('Expenses (continued)', 20, yOffset);
        yOffset += 10;
      }
      doc.text(
        `${expense.type} | ₹${expense.amount.toFixed(2)} | ${new Date(expense.date).toLocaleDateString()} | ${expense.description || 'N/A'}`,
        20, yOffset + (i * 10)
      );
      yOffset += 10;
    });

    doc.save('Dental_Clinic_Overview.pdf');
    toast.success('PDF Downloaded!');
  };

  const downloadWord = async () => {
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            text: 'Dental Clinic Overview',
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: 'Summary Statistics',
            heading: HeadingLevel.HEADING_2,
          }),
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Metric')] }),
                  new TableCell({ children: [new Paragraph('Value')] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Total Patients')] }),
                  new TableCell({ children: [new Paragraph(stats.totalPatients.toString())] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Total Earnings')] }),
                  new TableCell({ children: [new Paragraph(`₹${stats.totalEarnings.toFixed(2)}`)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Total Appointments')] }),
                  new TableCell({ children: [new Paragraph(stats.totalAppointments.toString())] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Total Expenses')] }),
                  new TableCell({ children: [new Paragraph(`₹${stats.totalExpenses.toFixed(2)}`)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Net Profit')] }),
                  new TableCell({ children: [new Paragraph(`₹${(stats.totalEarnings - stats.totalExpenses).toFixed(2)}`)] }),
                ],
              }),
            ],
          }),
          new Paragraph({
            text: 'Patients',
            heading: HeadingLevel.HEADING_2,
          }),
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Name')] }),
                  new TableCell({ children: [new Paragraph('Treatment')] }),
                  new TableCell({ children: [new Paragraph('Registration Date')] }),
                  new TableCell({ children: [new Paragraph('Contact')] }),
                ],
              }),
              ...patients.slice(0, 10).map(patient =>
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph(patient.name)] }),
                    new TableCell({ children: [new Paragraph(patient.treatment || 'N/A')] }),
                    new TableCell({ children: [new Paragraph(new Date(patient.registrationDate).toLocaleDateString())] }),
                    new TableCell({ children: [new Paragraph(patient.contactDetails || 'N/A')] }),
                  ],
                })
              ),
            ],
          }),
          new Paragraph({
            text: 'Expenses',
            heading: HeadingLevel.HEADING_2,
          }),
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Type')] }),
                  new TableCell({ children: [new Paragraph('Amount')] }),
                  new TableCell({ children: [new Paragraph('Date')] }),
                  new TableCell({ children: [new Paragraph('Description')] }),
                ],
              }),
              ...expenses.slice(0, 10).map(expense =>
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph(expense.type)] }),
                    new TableCell({ children: [new Paragraph(`₹${expense.amount.toFixed(2)}`)] }),
                    new TableCell({ children: [new Paragraph(new Date(expense.date).toLocaleDateString())] }),
                    new TableCell({ children: [new Paragraph(expense.description || 'N/A')] }),
                  ],
                })
              ),
            ],
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Dental_Clinic_Overview.docx';
    link.click();
    toast.success('Word Document Downloaded!');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <FaDownload className="mr-2 text-gray-600" /> Export Data
      </h2>
      <div className="flex flex-wrap gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={downloadPDF}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <FaFilePdf className="mr-2" /> PDF
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={downloadWord}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          <FaFileWord className="mr-2" /> Word
        </motion.button>
      </div>
    </div>
  );
};

export default DownloadSection;
