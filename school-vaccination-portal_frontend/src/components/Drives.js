import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Table, Modal, Form } from 'react-bootstrap';

const Drives = () => {
  const navigate = useNavigate();
  const [drives, setDrives] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newDrive, setNewDrive] = useState({
    name: '',
    location: '',
    doses: '',
    date: '',
    classes: ''
  });

  // Load drives from localStorage
  useEffect(() => {
  fetch('/api/drives')
    .then(res => res.json())
    .then(data => setDrives(data))
    .catch(err => console.error('Failed to fetch drives:', err));
}, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDrive({ ...newDrive, [name]: value });
  };

  const validateDrive = () => {
    const { name, location, doses, date, classes } = newDrive;

    if (!name || !location || !doses || !date || !classes) {
      alert('All fields are required!');
      return false;
    }

    if (isNaN(doses) || Number(doses) <= 0) {
      alert('Doses must be a positive number.');
      return false;
    }

    const selectedDate = new Date(date);
    const today = new Date();
    const diffDays = Math.ceil((selectedDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 15) {
      alert('Drive must be scheduled at least 15 days in advance.');
      return false;
    }

    return true;
  };

  const handleAddDrive = () => {
    if (!validateDrive()) return;

    const updatedDrives = [
      ...drives,
      {
        id: Date.now().toString(),
        ...newDrive,
        doses: Number(newDrive.doses),
        classes: newDrive.classes.split(',').map(cls => cls.trim()),
        status: 'Upcoming'
      }
    ];

    localStorage.setItem('drives', JSON.stringify(updatedDrives));
    setDrives(updatedDrives);
    setShowModal(false);
    alert('Drive added successfully!');
    // Reset form
    setNewDrive({ name: '', location: '', doses: '', date: '', classes: '' });
  };

  const handleEdit = (id) => {
    navigate(`/drives/edit/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this drive?')) {
      const updatedDrives = drives.filter(d => d.id !== id);
      localStorage.setItem('drives', JSON.stringify(updatedDrives));
      setDrives(updatedDrives);
      alert('Drive deleted successfully!');
    }
  };

  const isPastDrive = (date) => {
    const driveDate = new Date(date);
    const today = new Date();
    today.setHours(0,0,0,0); // ignore time
    return driveDate < today;
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Manage Vaccination Drives</h2>
        <Button variant="outline-primary" onClick={() => setShowModal(true)}>
          ➕ Add Drive
        </Button>
      </div>

      {drives.length === 0 ? (
        <p>No upcoming drives.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Doses</th>
              <th>Date</th>
              <th>Classes</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drives.map(drive => (
              <tr key={drive.id} className={isPastDrive(drive.date) ? 'table-secondary' : ''}>
                <td>{drive.name}</td>
                <td>{drive.location}</td>
                <td>{drive.doses}</td>
                <td>{drive.date}</td>
                <td>{drive.classes?.join(', ')}</td>
                <td>{isPastDrive(drive.date) ? 'Completed' : 'Upcoming'}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(drive.id)}
                    disabled={isPastDrive(drive.date)}
                  >
                    ✏️ Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(drive.id)}
                  >
                    🗑️ Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Add Drive Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Drive</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Drive Name</Form.Label>
              <Form.Control type="text" name="name" value={newDrive.name} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control type="text" name="location" value={newDrive.location} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Doses</Form.Label>
              <Form.Control type="number" name="doses" value={newDrive.doses} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" name="date" value={newDrive.date} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Applicable Classes (comma-separated)</Form.Label>
              <Form.Control type="text" name="classes" value={newDrive.classes} onChange={handleInputChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddDrive}>Add Drive</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Drives;
