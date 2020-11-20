const {db} = require('../models');

exports.getAvailableRoom = async () => {
  let room = (
    await db.Room.aggregate([{$match: {active: false}}, {$sample: {size: 1}}])
  )[0];
  await db.Room.updateOne({code: room.code}, {$set: {active: true}});

  return room;
};

exports.updateRoom = async room => {
  await db.Room.updateOne({code: room}, {$set: {active: false}});
};
