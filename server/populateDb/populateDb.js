'use strict';

const mongoose = require('mongoose');
const problems = require('./problems');

const problemSchema = new mongoose.Schema({
  text: String,
});

const Problem = mongoose.model('Problem', problemSchema);

const postProblem = async prob => {
  try {
    const problem = new Problem(prob);
    await problem.save();
    return problem;
  } catch (err) {
    console.log(err);
  }
};

async function execute() {
  await mongoose.connect('mongodb://localhost:27017/stupid-inventions-db');
  problems.forEach(prob => {
    postProblem({
      text: prob,
    });
  });
}

execute();
