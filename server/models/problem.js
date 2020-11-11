const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  text: String,
});

module.exports = mongoose.model('Problem', problemSchema);