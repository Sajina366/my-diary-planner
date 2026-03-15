const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

const router = express.Router();

// Get all tasks
router.get('/', (req, res) => {
  db.all('SELECT * FROM tasks ORDER BY due_date ASC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create a new task
router.post('/', (req, res) => {
  const { title, description, priority, status, due_date } = req.body;
  const id = uuidv4();
  
  db.run(
    'INSERT INTO tasks (id, title, description, priority, status, due_date) VALUES (?, ?, ?, ?, ?, ?)',
    [id, title, description, priority || 'Medium', status || 'pending', due_date],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id, title, description, priority, status, due_date });
    }
  );
});

// Update a task
router.put('/:id', (req, res) => {
  const { title, description, priority, status, due_date } = req.body;
  
  db.run(
    'UPDATE tasks SET title = ?, description = ?, priority = ?, status = ?, due_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [title, description, priority, status, due_date, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Task updated successfully' });
    }
  );
});

// Delete a task
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM tasks WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Task deleted successfully' });
  });
});

module.exports = router;