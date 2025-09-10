const express = require('express');
const router = express.Router();
const Config = require('../models/Config');

router.get('/payment', async (req,res)=>{
  const p = await Config.findOne({ key:'payment' });
  res.json({ payment: p ? p.value : null });
});

router.post('/payment', async (req,res)=>{
  const { accountName, accountNumber, bank } = req.body;
  await Config.updateOne({ key:'payment' }, { key:'payment', value: { accountName, accountNumber, bank } }, { upsert:true });
  res.json({ ok:true });
});

module.exports = router;