const Player = require('../models/player');

exports.postPlayer = async (plr) => {
  try {
    const player = new Player(plr);
    await player.save();
    return plr;
  } catch (err) {
    console.log(err);
  }
};

exports.getPlayersInRoom = async (roomToCheck) => {
  return await Player.find({room: roomToCheck}, (err, players) => {
    if (err) console.log(err);
    return players;
  });
};

exports.updateProblem = async (input, name, room) => {
  try {
    await Player.updateOne({name: name, room: room}, { $set: { problem: input, done: true} });
  } catch (err) {
    console.log(err);
  }
};

exports.allDone = async (room) => {
  try {
    return (await Player.find({room: room}))
      .map(player => {
        return player.done;
      })
      .reduce((sum, next) => sum && next, true);
  } catch (err) {
    console.log(err);
  }
};

exports.resetDone = async (room) => {
  try {
    await Player.updateMany({room: room}, { $set: { done: false } });
  } catch (err) {
    console.log(err);
  }
};

exports.updateDrawing = async (socket, drawing) => {
  try {
    await Player.updateOne({socket: socket}, { $set: { drawing: drawing, done: true} });
  } catch (err) {
    console.log(err);
  }
};