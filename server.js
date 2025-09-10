require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const { MONGO_URI, PORT=3001 } = process.env;
if (MONGO_URI) {
  mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>console.log('MongoDB connected'))
    .catch(err=>console.error('Mongo error', err));
} else {
  console.log('MONGO_URI not set - running without DB (not recommended)');
}

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/exams', require('./routes/exams'));
app.use('/api/results', require('./routes/results'));
app.use('/api/config', require('./routes/config'));

app.get('/', (req,res)=> res.send({ok:true, message:'GWPSS Backend running'}));

const port = process.env.PORT || PORT;
app.listen(port, ()=> console.log('Server listening on', port));