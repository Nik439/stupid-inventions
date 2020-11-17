const mongoose = require('mongoose');

async function startDb () {
  await mongoose.connect('mongodb+srv://'+ process.env.DB_NAME +':'+ process.env.DB_PASS +'@'+ process.env.DB_URL);
}

module.exports = startDb;
