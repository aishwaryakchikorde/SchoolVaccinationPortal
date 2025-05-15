import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';

const EditDrive = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drive, setDrive] = useState({ name: '', date: '', location: '', doses: '' });
  const [isPastDrive, setIsPastDrive] = useState(false);

  useEffect(() => {
    const drives = JSON.parse(localStorage.getItem('drives')) || [];
    const currentDrive = drives.find(d => d.id === id);
    if (currentDrive) {
      setDrive(currentDrive);

      const today = new Date().setHours(0, 0, 0, 0);
      const driveDate = new Date(currentDrive.date).setHours(0, 0, 0, 0);

      if (driveDate < today) {
        setIsPastDrive(true);
      }
    } else {
      alert('Drive not found!');
      navigate('/drives');
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDrive(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const drives = JSON.parse(localStorage.getItem('drives')) || [];
    const updatedDrives = drives.map(d => (d.id === id ? drive : d));
    localStorage.setItem('drives', JSON.stringify(updatedDrives));
    alert('Drive updated successfully!');
    navigate('/drives');
  };

  return (
    <div className="container">
      <Card className="p-4 shadow-sm">
        <h3>Edit Vaccination Drive</h3>
        {isPastDrive && (
          <Alert variant="warning">
            This drive has already been completed. Editing is disabled.
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Drive Name</Form.Label>
            <Form.Control 
              type="text" 
              name="name" 
              value={drive.name} 
              onChange={handleChange} 
              required 
              disabled={isPastDrive} 
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control 
              type="date" 
              name="date" 
              value={drive.date} 
              onChange={handleChange} 
              required 
              disabled={isPastDrive} 
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control 
              type="text" 
              name="location" 
              value={drive.location} 
              onChange={handleChange} 
              required 
              disabled={isPastDrive} 
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Doses</Form.Label>
            <Form.Control 
              type="number" 
              name="doses" 
              value={drive.doses} 
              onChange={handleChange} 
              required 
              disabled={isPastDrive} 
            />
          </Form.Group>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={isPastDrive}
          >
            Save Changes
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default EditDrive;
