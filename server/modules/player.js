const mongoose = require('mogoose');

const playerSchema = new mongoose.Schema({
  socket: String,
  room: String,
  name: String,
  votes: { type: Number, default: 0 },
  done: { type: Boolean, default: false },
  problem: String,
  drawing: {
    name: String,
    url: String
  }
});

module.exports = mongoose.model('Player', playerSchema);