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
}