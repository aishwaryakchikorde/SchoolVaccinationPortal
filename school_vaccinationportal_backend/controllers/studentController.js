const fs = require('fs');
const csvParser = require('csv-parser');
const Student = require('../models/Student'); // Path looks fine if it's ../models/Student.js

exports.bulkUploadStudents = async (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on('data', (data) => {
      results.push({
        name: data.name,
        grade: data.grade,
        dob: new Date(data.dob),  // Convert CSV string to Date object
        studentId: data.studentId,
        vaccinationStatus: data.vaccinationStatus === 'true' // Convert string to boolean
      });
    })
    .on('end', async () => {
      try {
        await Student.insertMany(results);
        res.json({ message: 'Bulk upload successful', count: results.length });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Bulk upload failed', details: err.message });
      }
    });
};
