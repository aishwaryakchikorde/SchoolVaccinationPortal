// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const studentRoutes = require('./routes/studentRoutes');
const driveRoutes = require('./routes/driveRoutes');
const dashboardRoutes = require('./routes/dashboard')
const reportRoutes = require('./routes/reports');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/students', studentRoutes);
app.use('/api/drives', driveRoutes);
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/reports', reportRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.send('School Vaccine Portal Backend is running!');
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect('mongodb://localhost:27017/school_vaccination', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log('MongoDB connection failed:', err));


// server.js (Add route)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password123') {
    res.json({ success: true, token: 'mock-token-123' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});