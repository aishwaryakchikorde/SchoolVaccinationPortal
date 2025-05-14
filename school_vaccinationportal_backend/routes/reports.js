const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); // Assuming you already have this model

// GET /api/reports?filter=vaccineName&page=1&limit=10
router.get('/', async (req, res) => {
  try {
    const { filter, page = 1, limit = 10 } = req.query;

    // Pagination math
    const skip = (page - 1) * limit;

    // Base query: students with vaccinations
    const query = filter
      ? { 'vaccinations.vaccineName': filter }
      : { 'vaccinations.0': { $exists: true } };

    const students = await Student.find(query)
      .select('name studentId grade vaccinations')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Student.countDocuments(query);

    const formatted = students.map((s) => {
      return s.vaccinations.map((v) => ({
        name: s.name,
        studentId: s.studentId,
        grade: s.grade,
        vaccineName: v.vaccineName,
        vaccinationDate: v.date,
      }));
    }).flat();

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      data: formatted,
    });
  } catch (error) {
    console.error('Failed to fetch report:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
