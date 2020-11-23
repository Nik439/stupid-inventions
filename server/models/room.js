const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  code: String,
  active: {type: Boolean, default: false},
  gameStarted: {type: Boolean, default: false},
});

module.exports = mongoose.model('Room', roomSchema);
