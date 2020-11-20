const Problem = require('../models/problem');

exports.getProblem = async () => {
  try {
    let problem = (await Problem.aggregate([{$sample: {size: 1}}]))[0];

    return problem;
  } catch (err) {
    console.log(err);
  }
};
