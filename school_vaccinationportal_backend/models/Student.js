const mongoose = require('mongoose');

const vaccinationSchema = new mongoose.Schema({
  vaccineName: String,
  date: Date,
  driveId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drive', // Reference to the Drive model
  },
});

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
    unique: true,
  },
  grade: {
    type: String,
    required: true,
  },
  vaccinations: [vaccinationSchema], // Keep track of vaccinations in an array
});

module.exports = mongoose.model('Student', studentSchema);
