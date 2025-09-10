const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const configSchema = new Schema({
  key: { type: String, unique: true },
  value: Schema.Types.Mixed
});
module.exports = mongoose.model('Config', configSchema);