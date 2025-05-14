const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const multer = require('multer');
const { bulkUploadStudents } = require('../controllers/studentController');
const Drive = require('../models/Drive');

// Multer config
const upload = multer({ dest: 'uploads/' });

// Bulk Upload Endpoint (from Controller)
router.post('/bulk-upload', upload.single('file'), bulkUploadStudents);

// POST /students - Add new student
router.post('/', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /students - Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /students/:id - Remove a student by MongoDB _id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Student removed successfully', deletedStudent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:studentId/vaccinate', async (req, res) => {
  const { studentId } = req.params;
  const { driveId, vaccineName, date } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Prevent duplicate vaccination for same drive
    const alreadyVaccinated = student.vaccinations.some(
      (v) => v.driveId.toString() === driveId
    );
    if (alreadyVaccinated) {
      return res.status(400).json({ error: 'Student already vaccinated in this drive' });
    }

    // Add new vaccination record
    student.vaccinations.push({ driveId, vaccineName, date });
    await student.save();

    res.json({ message: 'Vaccination recorded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
