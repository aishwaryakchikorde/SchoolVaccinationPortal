import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VaccinationForm = ({ studentId, drives, onSuccess, onCancel }) => {
  const [driveId, setDriveId] = useState('');
  const [vaccineName, setVaccineName] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const vaccinationData = { vaccineName, date, driveId };

    try {
      await axios.put(`http://localhost:5000/api/students/${studentId}/vaccinate`, vaccinationData);
      onSuccess();
    } catch (error) {
      console.error('Error updating vaccination:', error);
    }
  };

  return (
    <div className="mt-3">
      <h4>Vaccinate Student</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label>Drive:</label>
          <select
            className="form-select"
            value={driveId}
            onChange={(e) => setDriveId(e.target.value)}
            required
          >
            <option value="">Select Drive</option>
            {drives.map((drive) => (
              <option key={drive._id} value={drive._id}>
                {drive.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label>Vaccine Name:</label>
          <input
            type="text"
            className="form-control"
            value={vaccineName}
            onChange={(e) => setVaccineName(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <label>Date:</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary me-2">Submit</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default VaccinationForm;
