const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// register student
router.post('/register', async (req,res)=>{
  const { name, regNo, password } = req.body;
  if(!name||!regNo||!password) return res.status(400).json({ error:'Missing' });
  const exists = await User.findOne({ type:'student', regNo });
  if(exists) return res.status(400).json({ error:'exists' });
  const hash = await bcrypt.hash(password, 10);
  const student = await User.create({ type:'student', name, regNo, passwordHash: hash });
  res.json({ ok:true, id: student._id });
});

// get student (includes results)
router.get('/:regNo', async (req,res)=>{
  const s = await User.findOne({ type:'student', regNo: req.params.regNo }).select('-passwordHash');
  if(!s) return res.status(404).json({ error:'not found' });
  res.json(s);
});

module.exports = router;