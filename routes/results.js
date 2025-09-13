const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Config = require('../models/Config');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

async function authAdmin(req,res,next){
  const token = req.headers.authorization?.split(' ')[1];
  if(!token) return res.status(401).json({ error:'missing token' });
  try{ const data = jwt.verify(token, JWT_SECRET); const u = await User.findById(data.id); if(!u || u.type!=='admin') return res.status(403).json({ error:'forbidden' }); req.user=u; next(); }catch(e){ return res.status(401).json({ error:'invalid token' }); }
}

// upload result for a student (admin)
router.post('/upload', authAdmin, async (req,res)=>{
  const { regNo, examId, result } = req.body;
  const student = await User.findOne({ type:'student', regNo });
  if(!student) return res.status(404).json({ error:'no student' });
  student.results = student.results || new Map();
  student.results.set(examId, result);
  await student.save();
  res.json({ ok:true });
});

// release results (admin)
router.post('/release', authAdmin, async (req,res)=>{
  await Config.updateOne({ key:'released' }, { key:'released', value: true }, { upsert:true });
  res.json({ ok:true });
});

// hide results (admin)
router.post('/hide', authAdmin, async (req,res)=>{
  await Config.updateOne({ key:'released' }, { key:'released', value: false }, { upsert:true });
  res.json({ ok:true });
});

// student get results only when released
router.get('/:regNo', async (req,res)=>{
  const rel = await Config.findOne({ key:'released' });
  const released = rel ? !!rel.value : false;
  if(!released) return res.status(403).json({ error:'not released' });
  const s = await User.findOne({ type:'student', regNo: req.params.regNo }).select('-passwordHash');
  if(!s) return res.status(404).json({ error:'not found' });
  res.json({ student: s });
});

module.exports = router;