const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

const router = express.Router();

// Get all meetings
router.get('/', (req, res) => {
  db.all('SELECT * FROM meetings ORDER BY date DESC, time DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create a new meeting
router.post('/', (req, res) => {
  const { title, date, time, location, participants, notes } = req.body;
  const id = uuidv4();
  
  db.run(
    'INSERT INTO meetings (id, title, date, time, location, participants, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, title, date, time, location, participants, notes],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id, title, date, time, location, participants, notes });
    }
  );
});

// Delete a meeting
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM meetings WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Meeting deleted successfully' });
  });
});

module.exports = router;