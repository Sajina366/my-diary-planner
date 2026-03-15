const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Database initialization
const db = require('./config/database');

// Routes
app.use('/api/diary', require('./routes/diary'));
app.use('/api/meetings', require('./routes/meetings'));
app.use('/api/tasks', require('./routes/tasks'));

// Main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🎉 My Diary Planner is running on http://localhost:${PORT}`);
});
