const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');

// create exam (admin)
router.post('/create', async (req,res)=>{
  const { title, durationMinutes, mcqs, written } = req.body;
  const exam = await Exam.create({ title, durationMinutes, mcqs, written });
  res.json({ ok:true, id: exam._id });
});

// list exams
router.get('/', async (req,res)=>{
  const exams = await Exam.find();
  res.json(exams);
});

// get exam by id (for student)
router.get('/:id', async (req,res)=>{
  const exam = await Exam.findById(req.params.id);
  if(!exam) return res.status(404).json({ error:'not found' });
  res.json(exam);
});

module.exports = router;