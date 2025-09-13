require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// simple file storage for receipts (in memory folder 'uploads' - Render will persist per instance)
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);
app.use('/uploads', express.static(UPLOAD_DIR));

const { MONGO_URI, PORT=3001, JWT_SECRET='changeme' } = process.env;

if (MONGO_URI) {
  mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>console.log('MongoDB connected'))
    .catch(err=>console.error('Mongo connect error', err));
} else {
  console.warn('MONGO_URI not set - server will run but DB operations will fail');
}

// mount routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/exams', require('./routes/exams'));
app.use('/api/results', require('./routes/results'));
app.use('/api/config', require('./routes/config'));

app.get('/', (req,res)=> res.json({ ok:true, message:'GWPSS backend online' }));

const port = process.env.PORT || PORT;
app.listen(port, ()=> console.log('Server listening on', port));