import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Form, Pagination } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // <- THIS is the correct way for latest versions



const ReportsPage = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [vaccineFilter, setVaccineFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const res = await axios.get('/api/students');
    setStudents(res.data);
    setFilteredStudents(res.data);
  };

  // Filter logic
  useEffect(() => {
    if (vaccineFilter) {
      setFilteredStudents(
        students.filter(student =>
          student.vaccinations.some(v => v.vaccineName === vaccineFilter)
        )
      );
      setCurrentPage(1);
    } else {
      setFilteredStudents(students);
    }
  }, [vaccineFilter, students]);

  const exportToCSV = () => {
  const headers = ["Name", "Student ID", "Grade", "Vaccinations"];
  const rows = students.map(student => [
    student.name,
    student.studentId,
    student.grade,
    student.vaccinations.map(v => `${v.vaccineName} (${v.date})`).join('; ')
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(e => e.join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "students_report.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



 const exportToPDF = () => {
  const doc = new jsPDF();
  const tableColumn = ["Name", "Student ID", "Grade", "Vaccinations"];
  const tableRows = students.map(student => [
    student.name,
    student.studentId,
    student.grade,
    student.vaccinations.map(v => `${v.vaccineName} (${v.date})`).join('; ')
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
  });

  doc.save("students_report.pdf");
};
   

  // Pagination calculations
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  return (
    <div className="container mt-4">
      <h2>Reports</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Select
          value={vaccineFilter}
          onChange={e => setVaccineFilter(e.target.value)}
          style={{ width: '250px' }}
        >
          <option value="">Filter by Vaccine</option>
          {[...new Set(students.flatMap(s => s.vaccinations.map(v => v.vaccineName)))]
            .filter(Boolean)
            .map(name => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
        </Form.Select>

        <div>
          <Button variant="success" className="me-2" onClick={exportToCSV}>
            Export Excel
          </Button>
          <Button variant="danger" onClick={exportToPDF}>
            Export PDF
          </Button>
          <Button variant="warning" onClick={exportToPDF}>
            Export CSV
          </Button>
        </div>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Student ID</th>
            <th>Grade</th>
            <th>Vaccinations</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map(student => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.studentId}</td>
              <td>{student.grade}</td>
              <td>
                {student.vaccinations.length > 0
                  ? student.vaccinations.map(v => (
                      <div key={v._id}>
                        {v.vaccineName} ({v.date})
                      </div>
                    ))
                  : 'No Vaccinations'}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {totalPages > 1 && (
        <Pagination>
          {[...Array(totalPages).keys()].map(pageNum => (
            <Pagination.Item
              key={pageNum + 1}
              active={pageNum + 1 === currentPage}
              onClick={() => setCurrentPage(pageNum + 1)}
            >
              {pageNum + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
    </div>
  );
};

export default ReportsPage;
