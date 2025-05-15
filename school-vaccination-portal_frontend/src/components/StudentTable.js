import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap';
import StudentForm from './StudentForm';
import VaccinationForm from './VaccinationForm';

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [drives, setDrives] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [vaccinatingStudent, setVaccinatingStudent] = useState(null);

  // Fetch students
  const fetchStudents = async () => {
    const res = await axios.get('/api/students');
    setStudents(res.data);
  };

 const fetchDrives = async () => {
  try {
    const response = await fetch('/api/drives');
    const drives = await response.json();

    if (drives.length === 0) {
      // 👇 Dummy data injection if backend gives nothing
      const dummyDrives = [
        { _id: '1', name: 'Polio Drive', date: '2025-06-01', location: 'Auditorium' },
        { _id: '2', name: 'Hepatitis B Drive', date: '2025-06-15', location: 'School Clinic' },
        { _id: '3', name: 'Covid Booster', date: '2025-07-05', location: 'Main Hall' },
      ];
      setDrives(dummyDrives);
    } else {
      setDrives(drives);
    }
  } catch (error) {
    console.error('Failed to fetch drives:', error);

    // 👇 On API failure, also use dummy data
    const dummyDrives = [
      { _id: '1', name: 'Polio Drive', date: '2025-06-01', location: 'Auditorium' },
      { _id: '2', name: 'Hepatitis B Drive', date: '2025-06-15', location: 'School Clinic' },
      { _id: '3', name: 'Covid Booster', date: '2025-07-05', location: 'Main Hall' },
    ];
    setDrives(dummyDrives);
  }
};


  useEffect(() => {
    fetchStudents();
    }, []);

  // Add new student
  const handleSaveStudent = async (studentData) => {
    await axios.post('/api/students', studentData);
    fetchStudents();
    setShowForm(false);
  };

  // Delete student
  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      await axios.delete(`/api/students/${studentId}`);
      fetchStudents();
    }
  };

  // Vaccinate student (opens form)
 const handleVaccinate = async (student) => {
  await fetchDrives();
  setVaccinatingStudent(student);
};

  // Filtered students based on search
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studentId.includes(searchTerm) ||
    s.grade.includes(searchTerm) ||
    (s.vaccinations.length > 0 ? 'vaccinated' : 'not vaccinated').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2>Manage Students</h2>
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          placeholder="Search by Name, Grade, ID, Status"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control w-50"
        />
        <Button onClick={() => setShowForm(true)}>Add Student</Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Grade</th>
            <th>Vaccinated?</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.grade}</td>
              <td>{student.vaccinations.length > 0 ? '✅ Yes' : '❌ No'}</td>
              <td>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleVaccinate(student)}
                  className="me-2"
                >
                  Vaccinate
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(student._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showForm && (
        <StudentForm
          show={showForm}
          handleClose={() => setShowForm(false)}
          handleSave={handleSaveStudent}
        />
      )}

      {vaccinatingStudent && (
        <VaccinationForm
          studentId={vaccinatingStudent._id}
          drives={drives}
          onSuccess={() => {
            fetchStudents();
            setVaccinatingStudent(null);
          }}
          onCancel={() => setVaccinatingStudent(null)}
        />
      )}
    </div>
  );
};

export default StudentTable;
