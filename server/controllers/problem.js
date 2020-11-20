const {db} = require('../models');

exports.getProblem = async () => {
  try {
    let problem = (await db.Problem.aggregate([{$sample: {size: 1}}]))[0];

    return problem;
  } catch (err) {
    console.log(err);
  }
};
