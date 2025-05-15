import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const StudentForm = ({ show, handleClose, handleSave, student }) => {
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    studentId: ''
  });

  // Populate form data if editing
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        grade: student.grade || '',
        studentId: student.studentId || ''
      });
    } else {
      setFormData({ name: '', grade: '', studentId: '' });
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.grade || !formData.studentId) {
      alert('Please fill in all fields');
      return;
    }
    handleSave(formData);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{student ? 'Edit Student' : 'Add Student'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formStudentName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formGrade">
            <Form.Label>Grade</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formStudentId">
            <Form.Label>Student ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter student ID"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StudentForm;
