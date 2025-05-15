import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { FaUserGraduate, FaSyringe, FaCalendarCheck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [drives, setDrives] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  const [vaccinatedCount, setVaccinatedCount] = useState(0);

  useEffect(() => {
    const storedDrives = JSON.parse(localStorage.getItem('drives')) || [];
    setDrives(storedDrives);

    const students = JSON.parse(localStorage.getItem('students')) || [];
    const vaccinated = students.filter(s => s.vaccinated).length;

    setStudentCount(students.length);
    setVaccinatedCount(vaccinated);
  }, []);

  const today = new Date();
  const upcomingDrives = drives.filter(d => new Date(d.date) >= today);
  const completedDrives = drives.filter(d => new Date(d.date) < today);

  const vaccinationPercentage = studentCount > 0
    ? ((vaccinatedCount / studentCount) * 100).toFixed(2)
    : '0.00';

  return (
    
    <div className="container mt-4">
      <h2>Dashboard Overview</h2>

       

<div className="text-end mb-3">
  <Link to="/drives" className="btn btn-primary">
    Manage Drives
  </Link>
</div>


      <div className="dashboard-metrics">
        <Card className="metric-card">
          <FaUserGraduate className="metric-icon" />
          <div>
            <p>Total Students</p>
            <h3>{studentCount}</h3>
          </div>
        </Card>
        <Card className="metric-card">
          <FaSyringe className="metric-icon" />
          <div>
            <p>Vaccinated Students</p>
            <h3>{vaccinatedCount} ({vaccinationPercentage}%)</h3>
          </div>
        </Card>
        <Card className="metric-card">
          <FaCalendarCheck className="metric-icon" />
          <div>
            <p>Upcoming Drives</p>
            <h3>{upcomingDrives.length}</h3>
          </div>
        </Card>
      </div>

      <h3 className="upcoming-title">Upcoming Vaccination Drives</h3>
      {upcomingDrives.length > 0 ? (
        <ul className="drive-list">
          {upcomingDrives.map(drive => (
            <li key={drive._id}>
              <FaCheckCircle className="drive-icon text-success" />
              {drive.name} on {drive.date} ({drive.location})
            </li>
          ))}
        </ul>
      ) : (
        <p>No upcoming drives scheduled.</p>
      )}

      <h3 className="upcoming-title mt-5">Completed Drives</h3>
      {completedDrives.length > 0 ? (
        <ul className="drive-list">
          {completedDrives.map(drive => (
            <li key={drive.id}>
              <FaTimesCircle className="drive-icon text-danger" />
              {drive.name} on {drive.date} ({drive.location})
            </li>
          ))}
        </ul>
      ) : (
        <p>No completed drives.</p>
      )}
    </div>
  );
};

export default Dashboard;
