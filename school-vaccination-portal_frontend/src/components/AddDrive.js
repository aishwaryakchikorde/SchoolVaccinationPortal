import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card } from 'react-bootstrap';

const AddDrive = () => {
  const navigate = useNavigate();
  const [drive, setDrive] = useState({ name: '', date: '', location: '', doses: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDrive(prev => ({ ...prev, [name]: value }));
  };

  const validateDrive = (newDrive, existingDrives) => {
    const today = new Date();
    const driveDate = new Date(newDrive.date);

    const diffDays = Math.ceil((driveDate - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 15) {
      alert('Drives must be scheduled at least 15 days in advance.');
      return false;
    }

    const overlap = existingDrives.some(d => d.date === newDrive.date);
    if (overlap) {
      alert('A drive is already scheduled on this date. Please choose another date.');
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const drives = JSON.parse(localStorage.getItem('drives')) || [];

    if (!validateDrive(drive, drives)) return;

    const newDrive = {
      ...drive,
      id: Date.now().toString(), // Unique ID
      classes: ['Grade 5', 'Grade 6'], // You can enhance this with a multiselect later
    };

    const updatedDrives = [...drives, newDrive];
    localStorage.setItem('drives', JSON.stringify(updatedDrives));
    alert('Drive added successfully!');
    navigate('/drives');
  };

  return (
    <div className="container">
      <Card className="p-4 shadow-sm">
        <h3>Add Vaccination Drive</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Drive Name</Form.Label>
            <Form.Control type="text" name="name" value={drive.name} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control type="date" name="date" value={drive.date} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control type="text" name="location" value={drive.location} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Doses</Form.Label>
            <Form.Control type="number" name="doses" value={drive.doses} onChange={handleChange} required />
          </Form.Group>
          <Button variant="success" type="submit">
            Add Drive
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default AddDrive;
