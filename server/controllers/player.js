const {db} = require('../models');

exports.postPlayer = async plr => {
  try {
    const player = new db.Player(plr);
    await player.save();
    return plr;
  } catch (err) {
    console.error(err);
  }
};

exports.getPlayersInRoom = async code => {
  return await db.Player.find({room: code}, (err, players) => {
    if (err) console.error(err);
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
    console.error(err);
  }
};

exports.setDone = async (name, room) => {
  try {
    await db.Player.updateOne({name, room}, {$set: {done: true}});
  } catch (err) {
    console.error(err);
  }
};

exports.allDone = async room => {
  try {
    return (await db.Player.find({room}))
      .map(player => {
        return player.done;
      })
      .reduce((sum, next) => sum && next, true);
  } catch (err) {
    console.error(err);
  }
};

exports.resetDone = async room => {
  try {
    await db.Player.updateMany({room}, {$set: {done: false}});
  } catch (err) {
    console.error(err);
  }
};

exports.updateDrawing = async (socket, drawing) => {
  try {
    await db.Player.updateOne({socket}, {$set: {drawing, done: true}});
  } catch (err) {
    console.error(err);
  }
};

exports.upvoteDrawing = async (name, room) => {
  try {
    await db.Player.updateOne({name, room}, {$inc: {votes: 1}});
  } catch (err) {
    console.error(err);
  }
};

exports.getLeaderboard = async room => {
  return (await db.Player.find({room}))
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
  return await db.Player.findOne({socket}, (err, player) => {
    if (err) console.error(err);
    return player;
  });
};

exports.removePlayer = socket => {
  db.Player.deleteOne({socket}, err => {
    if (err) console.error(err);
  });
};
