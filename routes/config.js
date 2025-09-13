const express = require('express');
const router = express.Router();
const Config = require('../models/Config');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

async function authAdmin(req,res,next){
  const token = req.headers.authorization?.split(' ')[1];
  if(!token) return res.status(401).json({ error:'missing token' });
  try{ const data = jwt.verify(token, JWT_SECRET); const u = await User.findById(data.id); if(!u || u.type!=='admin') return res.status(403).json({ error:'forbidden' }); req.user=u; next(); }catch(e){ return res.status(401).json({ error:'invalid token' }); }
}

router.get('/payment', async (req,res)=>{
  const p = await Config.findOne({ key:'payment' });
  res.json({ payment: p ? p.value : null });
});

router.post('/payment', authAdmin, async (req,res)=>{
  const { accountName, accountNumber, bank } = req.body;
  await Config.updateOne({ key:'payment' }, { key:'payment', value: { accountName, accountNumber, bank } }, { upsert:true });
  res.json({ ok:true });
});

router.get('/receipts', authAdmin, async (req,res)=>{
  const p = await Config.findOne({ key:'payments' });
  res.json({ payments: p ? p.value : [] });
});

router.post('/receipts', authAdmin, async (req,res)=>{
  const { regNo, amount, ref, status='pending' } = req.body;
  const p = await Config.findOne({ key:'payments' });
  const arr = p ? p.value : [];
  arr.push({ id: Date.now().toString(), regNo, amount, ref, status });
  await Config.updateOne({ key:'payments' }, { key:'payments', value: arr }, { upsert:true });
  res.json({ ok:true });
});

module.exports = router;