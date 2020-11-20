const mongoose = require('mongoose');
const Player = require('./player');
const Problem = require('./problem');
const Room = require('./room');

exports.db = {
  Player,
  Problem,
  Room,
};

exports.startDb = async function startDb() {
  await mongoose.connect(
    'mongodb+srv://' +
      process.env.DB_NAME +
      ':' +
      process.env.DB_PASS +
      '@' +
      process.env.DB_URL,
  );
};
