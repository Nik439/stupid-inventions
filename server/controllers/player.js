const {db} = require('../models');

exports.postPlayer = async plr => {
  try {
    const player = new db.Player(plr);
    await player.save();
    return plr;
  } catch (err) {
    console.log(err);
  }
};

exports.getPlayersInRoom = async roomToCheck => {
  return await db.Player.find({room: roomToCheck}, (err, players) => {
    if (err) console.log(err);
    return players;
  });
};

exports.updateProblem = async (input, name, room) => {
  try {
    await db.Player.updateOne(
      {name: name, room: room},
      {$set: {problem: input, done: true}},
    );
  } catch (err) {
    console.log(err);
  }
};

exports.setDone = async (name, room) => {
  try {
    await db.Player.updateOne({name: name, room: room}, {$set: {done: true}});
  } catch (err) {
    console.log(err);
  }
};

exports.allDone = async room => {
  try {
    return (await db.Player.find({room: room}))
      .map(player => {
        return player.done;
      })
      .reduce((sum, next) => sum && next, true);
  } catch (err) {
    console.log(err);
  }
};

exports.resetDone = async room => {
  try {
    await db.Player.updateMany({room: room}, {$set: {done: false}});
  } catch (err) {
    console.log(err);
  }
};

exports.updateDrawing = async (socket, drawing) => {
  try {
    await db.Player.updateOne(
      {socket: socket},
      {$set: {drawing: drawing, done: true}},
    );
  } catch (err) {
    console.log(err);
  }
};

exports.upvoteDrawing = async (name, room) => {
  try {
    await db.Player.updateOne({name: name, room: room}, {$inc: {votes: 1}});
  } catch (err) {
    console.log(err);
  }
};

exports.getLeaderboard = async room => {
  return (await db.Player.find({room: room}))
    .map(player => {
      let plr = {
        name: player.name,
        votes: player.votes,
      };
      return plr;
    })
    .sort((plr, next) => {
      next.votes - plr.votes;
    });
};

exports.getPlayerBySocket = async socket => {
  return await db.Player.findOne({socket: socket}, (err, player) => {
    if (err) console.log(err);
    return player;
  });
};

exports.removePlayer = socket => {
  db.Player.deleteOne({socket: socket}, err => {
    if (err) console.log(err);
  });
};
