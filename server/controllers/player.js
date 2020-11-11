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