const mongoose = require('mongoose');

async function startDb() {
  await mongoose.connect('mongodb+srv://admiNik:0cdeVmaZnqwAvnJ8@cluster0.dgiv3.mongodb.net/stupid-inventions?retryWrites=true&w=majority');
}

module.exports = startDb;
