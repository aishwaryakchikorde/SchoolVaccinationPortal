import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VaccinationForm from './VaccinationForm';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/students')
      .then(response => setStudents(response.data))
      .catch(error => console.error('Error fetching students:', error));
  }, []);

  const handleVaccinateClick = (studentId) => {
    setSelectedStudentId(studentId);
  };

  return (
    <div>
      <h2>Student List</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Student ID</th>
            <th>Grade</th>
            <th>Vaccination Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.studentId}</td>
              <td>{student.grade}</td>
              <td>{student.vaccinations.length > 0 ? 'Vaccinated' : 'Not Vaccinated'}</td>
              <td>
                <button onClick={() => handleVaccinateClick(student._id)}>
                  Vaccinate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedStudentId && (
        <div style={{ marginTop: '20px' }}>
          <h3>Vaccinate Student</h3>
          <VaccinationForm studentId={selectedStudentId} />
        </div>
      )}
    </div>
  );
};

export default StudentList;
