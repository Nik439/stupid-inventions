'use strict';

const mongoose = require('mongoose');
const problems = require('./problems');
const chars = require('./codeChars');

// SCHEMAS

const roomSchema = new mongoose.Schema({
  code: String,
  active: { type: Boolean, default: false }
});

const problemSchema = new mongoose.Schema({
  text: String,
});

//MODELS

const Room = mongoose.model('Room', roomSchema);
const Problem = mongoose.model('Problem', problemSchema);

// GENERATE PROBLEM CODES ON DATABASE

const postProblem = async (prob) => {
  try {
    const problem = new Problem(prob);
    await problem.save();
    return problem;
  } catch (err) {
    console.log(err);
  }
};

// GENERATE ROOM CODE ON DATABASE

const postRoom = async (rm) => {
  try {
    const room = new Room(rm);
    await room.save();
    return room;
  } catch (err) {
    console.log(err);
  }
};

// CREATE CODES FROM CHARACTERS ARRAY

function codes (arr, name='', words=[]) {
  if (name.length === 3) {
    words.push(name);
  } else {
    for (let i in arr) {
      words.push(...codes(arr, name + arr[i]));
    }
  }
  return words;
}


async function execute () {
  await mongoose.connect('mongodb://localhost:27017/stupid-inventions-db');

  codes(chars).forEach(code => {
    postRoom({
      code: code
    });
  });

  problems.forEach(prob => {
    postProblem({
      text: prob
    });
  });
}

execute();

