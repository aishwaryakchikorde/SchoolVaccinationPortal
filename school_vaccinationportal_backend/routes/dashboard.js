const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Drive = require('../models/Drive');

router.get('/overview', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const vaccinatedStudents = await Student.countDocuments({ 'vaccinations.0': { $exists: true } });

    const vaccinatedPercentage = totalStudents > 0
      ? ((vaccinatedStudents / totalStudents) * 100).toFixed(2)
      : 0;

    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);

    const upcomingDrives = await Drive.find({
      date: { $gte: today, $lte: next30Days }
    }).select('name location date');

    res.json({
      totalStudents,
      vaccinatedStudents,
      vaccinatedPercentage,
      upcomingDrives
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

module.exports = router;
