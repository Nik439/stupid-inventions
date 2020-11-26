const {db} = require('../models');

exports.getAvailableRoom = async () => {
  let found = false;
  let code;

  // code generation
  while (!found) {
    code = '';

    for (let i = 0; i < 3; i++) {
      code += String.fromCharCode(Math.floor(Math.random() * 25.999) + 65);
    }

    if (!(await db.Room.findOne({code}))) {
      found = true;
    }
  }

  return await db.Room.create({code});
};

exports.updateRoom = async code => {
  await db.Room.deleteOne({code}, function (err) {
    if (err) {
      console.error(err);
    }
  });
};

exports.checkRoomStatus = async code => {
  return await db.Room.findOne({code});
};

exports.updateStartGameStatus = async code => {
  await db.Room.updateOne({code}, {$set: {gameStarted: true}});
};
