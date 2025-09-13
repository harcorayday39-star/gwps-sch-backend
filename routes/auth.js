const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Admin login
router.post('/admin/login', async (req,res)=>{
  const { email, password } = req.body;
  const user = await User.findOne({ type:'admin', email });
  if(!user) return res.status(401).json({ error:'Invalid' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if(!ok) return res.status(401).json({ error:'Invalid' });
  const token = jwt.sign({ id: user._id, type:'admin' }, JWT_SECRET, { expiresIn:'8h' });
  res.json({ token });
});

// Student login (by regNo)
router.post('/student/login', async (req,res)=>{
  const { regNo, password } = req.body;
  const user = await User.findOne({ type:'student', regNo });
  if(!user) return res.status(401).json({ error:'Invalid' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if(!ok) return res.status(401).json({ error:'Invalid' });
  const token = jwt.sign({ id: user._id, type:'student' }, JWT_SECRET, { expiresIn:'8h' });
  res.json({ token, regNo: user.regNo });
});

module.exports = router;