const express = require('express');
const router = express.Router();
const Drive = require('../models/Drive');

// Get All Drives
router.get('/', async (req, res) => {
  try {
    const drives = await Drive.find()
    res.json(drives);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch drives.' });
  }
});


// Add New Drive
router.post('/', async (req, res) => {
  try {
    const { name, vaccineName, date, availableDoses, applicableClasses } = req.body;
    const driveDate = new Date(date);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validation: 15 days in advance
    const minAllowedDate = new Date();
    minAllowedDate.setDate(today.getDate() + 15);

    if (driveDate < minAllowedDate) {
      return res.status(400).json({ message: 'Drive must be scheduled at least 15 days in advance.' });
    }

    // Validation: Prevent overlapping drives (same date)
    const existingDrive = await Drive.findOne({ date: driveDate });
    if (existingDrive) {
      return res.status(400).json({ message: 'A drive is already scheduled on this date.' });
    }

    const newDrive = new Drive({ name, vaccineName, date: driveDate, availableDoses, applicableClasses });
    await newDrive.save();

    res.status(201).json({ message: 'Drive created successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create drive.' });
  }
});

router.put('/students/:id/vaccinate', async (req, res) => {
  try {
    console.log('Vaccination Data Received:', req.body);
    console.log('Student ID:', req.params.id);

    const updateResult = await Student.updateOne(
      { _id: req.params.id },
      { $push: { vaccinations: req.body } }
    );

    console.log('Mongo Update Result:', updateResult);

    if (updateResult.modifiedCount === 0) {
      return res.status(404).json({ message: 'Student not found or not updated' });
    }

    res.json({ message: 'Vaccination recorded!' });
  } catch (error) {
    console.error('Backend Error:', error);
    res.status(500).json({ message: 'Failed to record vaccination', error: error.message });
  }
});


// Delete Drive (only future drives)
router.delete('/:id', async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id);
    if (!drive) return res.status(404).json({ message: 'Drive not found.' });

    const today = new Date();
    if (drive.date <= today) {
      return res.status(400).json({ message: 'Cannot delete past drives.' });
    }

    await Drive.findByIdAndDelete(req.params.id);

    res.json({ message: 'Drive deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete drive.' });
  }
});

module.exports = router;
