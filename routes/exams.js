const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

async function authAdmin(req,res,next){
  const token = req.headers.authorization?.split(' ')[1];
  if(!token) return res.status(401).json({ error:'missing token' });
  try{ const data = jwt.verify(token, JWT_SECRET); const u = await User.findById(data.id); if(!u || u.type!=='admin') return res.status(403).json({ error:'forbidden' }); req.user=u; next(); }catch(e){ return res.status(401).json({ error:'invalid token' }); }
}

// create exam (admin)
router.post('/create', authAdmin, async (req,res)=>{
  const { title, durationMinutes, mcqs, written, syllabus } = req.body;
  const exam = await Exam.create({ title, durationMinutes, mcqs, written, syllabus, createdBy: req.user._id });
  res.json({ ok:true, id: exam._id });
});

// list exams (public) - hide answers
router.get('/', async (req,res)=>{
  const exams = await Exam.find().select('-mcqs.answerIndex');
  res.json(exams);
});

// get exam by id (for student) - hide answers
router.get('/:id', async (req,res)=>{
  const exam = await Exam.findById(req.params.id);
  if(!exam) return res.status(404).json({ error:'not found' });
  const safe = exam.toObject();
  if(safe.mcqs) safe.mcqs = safe.mcqs.map(m=>({ q:m.q, options:m.options }));
  res.json(safe);
});

module.exports = router;