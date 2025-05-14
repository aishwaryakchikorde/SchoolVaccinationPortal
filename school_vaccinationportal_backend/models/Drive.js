const mongoose = require('mongoose');

const driveSchema = new mongoose.Schema({
  name: String,
  vaccineName: String,
  date: Date,
  availableDoses: Number,
  applicableClasses: [String]
});

module.exports = mongoose.model('Drive', driveSchema);
