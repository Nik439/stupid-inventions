const Room = require('../models/room');

exports.getAvailableRoom = async () => {
  let room = (
    await Room.aggregate([{$match: {active: false}}, {$sample: {size: 1}}])
  )[0];
  await Room.updateOne({code: room.code}, {$set: {active: true}});

  return room;
};

exports.updateRoom = async room => {
  await Room.updateOne({code: room}, {$set: {active: false}});
};
