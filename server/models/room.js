const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  code: String,
  gameStarted: {type: Boolean, default: false},
});

module.exports = mongoose.model('Room', roomSchema);
