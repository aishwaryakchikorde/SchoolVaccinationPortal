import React, { useState } from 'react';
import axios from 'axios';

const BulkUpload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a CSV file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/students/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(`Upload successful! ${response.data.count} students added.`);
    } catch (error) {
      alert('Bulk upload failed: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="container">
      <h2>Bulk Upload Students</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: '10px' }}>Upload</button>
    </div>
  );
};

export default BulkUpload;
