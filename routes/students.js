const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Helper: admin auth
async function authAdmin(req,res,next){
  const token = req.headers.authorization?.split(' ')[1];
  if(!token) return res.status(401).json({ error:'missing token' });
  try{
    const data = jwt.verify(token, JWT_SECRET);
    const u = await User.findById(data.id);
    if(!u || u.type !== 'admin') return res.status(403).json({ error:'forbidden' });
    req.user = u; next();
  }catch(e){ return res.status(401).json({ error:'invalid token' }); }
}

// Register student (admin only)
router.post('/register', authAdmin, async (req,res)=>{
  const { name, regNo, password } = req.body;
  if(!name||!regNo||!password) return res.status(400).json({ error:'Missing' });
  const exists = await User.findOne({ type:'student', regNo });
  if(exists) return res.status(400).json({ error:'exists' });
  const hash = await bcrypt.hash(password, 10);
  const student = await User.create({ type:'student', name, regNo, passwordHash: hash });
  res.json({ ok:true, id: student._id });
});

# get student (admin or the student themselves)
router.get('/:regNo', async (req,res)=>{
  const token = req.headers.authorization?.split(' ')[1];
  let isAdmin = false, requester = null;
  if(token){
    try{ const data = jwt.verify(token, process.env.JWT_SECRET || 'secret'); requester = await User.findById(data.id); if(requester && requester.type==='admin') isAdmin=true; }
    catch(e){}
  }
  const s = await User.findOne({ type:'student', regNo: req.params.regNo }).select('-passwordHash');
  if(!s) return res.status(404).json({ error:'not found' });
  // if requester is not admin and not the same student, restrict some info
  if(!isAdmin && requester?.regNo !== s.regNo){
    return res.status(403).json({ error:'forbidden' });
  }
  res.json(s);
});

module.exports = router;