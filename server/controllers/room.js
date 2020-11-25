const {db} = require('../models');

exports.getAvailableRoom = async () => {
  let roomFound=false;
  let roomCode;
  while (!roomFound) {
    roomCode='';
    for (let i=0;i<3;i++) {
      roomCode+=String.fromCharCode(Math.floor(Math.random()*25.999)+65)
    }
    if (!(await db.Room.findOne({code:roomCode}))) {
      roomFound=true;
    }
  }
  return await db.Room.create({code:roomCode});
};

exports.updateRoom = async room => {
  await db.Room.deleteOne({code: room}, function(err) {
    if (err) {
      console.error(err);
    }
  });
};

exports.checkRoomStatus = async room => {
  return await db.Room.findOne({code: room});
};

exports.updateStartGameStatus = async room => {
  await db.Room.updateOne({code: room}, {$set: {gameStarted: true}});
};
