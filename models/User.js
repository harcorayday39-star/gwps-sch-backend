const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
  type: { type: String, enum: ['admin','student'], required: true },
  email: { type: String, index: true },
  username: String,
  name: String,
  regNo: { type: String, index: true },
  passwordHash: String,
  results: { type: Map, of: Schema.Types.Mixed }
}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);