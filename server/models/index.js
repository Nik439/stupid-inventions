const mongoose = require('mongoose');
const Player = require('./player');
const Problem = require('./problem');
const Room = require('./room');
const config = require('../config');

exports.db = {
  Player,
  Problem,
  Room,
};

exports.startDb = async function startDb() {
  await mongoose.connect(config.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
