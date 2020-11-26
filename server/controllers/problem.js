const {db} = require('../models');

exports.getProblem = async () => {
  try {
    return (await db.Problem.aggregate([{$sample: {size: 1}}]))[0];
  } catch (err) {
    console.log(err);
  }
};
