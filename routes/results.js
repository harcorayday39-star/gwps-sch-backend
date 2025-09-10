const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Config = require('../models/Config');

// upload result (admin)
router.post('/upload', async (req,res)=>{
  const { regNo, examId, data } = req.body;
  const student = await User.findOne({ type:'student', regNo });
  if(!student) return res.status(404).json({ error:'no student' });
  student.results = student.results || new Map();
  student.results.set(examId, data);
  await student.save();
  res.json({ ok:true });
});

// release results (admin)
router.post('/release', async (req,res)=>{
  await Config.updateOne({ key:'released' }, { key:'released', value: true }, { upsert:true });
  res.json({ ok:true });
});

// student view results only if released
router.get('/:regNo', async (req,res)=>{
  const rel = await Config.findOne({ key:'released' });
  const released = rel ? !!rel.value : false;
  if(!released) return res.status(403).json({ error:'not released' });
  const s = await User.findOne({ type:'student', regNo: req.params.regNo }).select('-passwordHash');
  if(!s) return res.status(404).json({ error:'not found' });
  res.json({ student: s });
});

module.exports = router;