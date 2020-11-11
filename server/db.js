const mongoose = require('mongoose');

async function startDb() {
  await mongoose.connect('mongodb://localhost:27017/stupid-inventions-db');
}

module.exports = startDb;
