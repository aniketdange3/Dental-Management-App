import { useState, useEffect } from 'react';
import axios from 'axios';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState('');
  const [date, setDate] = useState('');
  const [treatment, setTreatment] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/patients')
      .then(response => setPatients(response.data))
      .catch(error => console.error('Error fetching patients:', error));

    axios.get('http://localhost:5000/api/appointments')
      .then(response => setAppointments(response.data))
      .catch(error => console.error('Error fetching appointments:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/appointments', { patient, date, treatment })
      .then(response => {
        setAppointments([...appointments, response.data]);
        setPatient('');
        setDate('');
        setTreatment('');
      })
      .catch(error => console.error('Error adding appointment:', error));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Appointments</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <select
          value={patient}
          onChange={(e) => setPatient(e.target.value)}
          className="p-2 border rounded mr-2"
          required
        >
          <option value="">Select Patient</option>
          {patients.map(patient => (
            <option key={patient._id} value={patient._id}>{patient.name}</option>
          ))}
        </select>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 border rounded mr-2"
          required
        />
        <input
          type="text"
          placeholder="Treatment"
          value={treatment}
          onChange={(e) => setTreatment(e.target.value)}
          className="p-2 border rounded mr-2"
          required
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">Add Appointment</button>
      </form>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Patient</th>
            <th className="py-2">Date</th>
            <th className="py-2">Treatment</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(appointment => (
            <tr key={appointment._id}>
              <td className="py-2">{appointment.patient?.name || 'Unknown'}</td>
              <td className="py-2">{new Date(appointment.date).toLocaleString()}</td>
              <td className="py-2">{appointment.treatment}</td>
              <td className="py-2">{appointment.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Appointments;
