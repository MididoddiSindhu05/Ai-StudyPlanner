import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'study-secret-123';

// Auth Routes
router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );
    const user = result.rows[0];

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        picture: user.picture, 
        streak: user.streak,
        productivity_score: user.productivity_score
      } 
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// User Routes
router.get('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT id, name, email, picture, role, streak, productivity_score FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, picture } = req.body;
    const result = await query(
      'UPDATE users SET name = $1, email = $2, picture = $3 WHERE id = $4 RETURNING id, name, email, picture, streak, productivity_score',
      [name, email, picture, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Task Routes
router.get('/tasks', async (req, res) => {
  const userId = req.headers['x-user-id']; 
  const result = await query('SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  res.json(result.rows);
});

router.post('/tasks', async (req, res) => {
  const { userId, title, subject, priority, status } = req.body;
  const result = await query(
    'INSERT INTO tasks (user_id, title, subject, priority, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [userId, title, subject, priority || 'Medium', status || 'Todo']
  );
  res.status(201).json(result.rows[0]);
});

export default router;
