require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const { MONGODB_URI, PORT=3001 } = process.env;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Mongo connect error', err));

app.get('/api/ping', (req,res) => res.json({ ok:true, message: "GWPS backend running" }));
app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});


app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
