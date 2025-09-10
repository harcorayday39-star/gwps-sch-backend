const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const examSchema = new Schema({
  title: String,
  durationMinutes: Number,
  mcqs: [{ q: String, options: [String], answerIndex: Number }],
  written: [{ q: String, mark: Number }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
module.exports = mongoose.model('Exam', examSchema);