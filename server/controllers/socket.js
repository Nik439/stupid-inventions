const player = require('./player');
const room = require('./room');
const problem = require('./problem');

exports.onHost = async function (socket, name) {
  console.log('called');
  let rm = await room.getAvailableRoom();

  console.log('Hosting on room:', rm.code);

  socket.join(rm.code);
  socket.emit('joinRoom', rm.code, true /*isHost*/);

  player.postPlayer({
    socket: socket.id,
    room: rm.code,
    name: name,
  });

  socket.emit('players', [name]);
};

exports.onJoin = async function (io, socket, roomToCheck, name) {
  const roomData = await room.checkRoomStatus(roomToCheck);
  if (!roomData.active || roomData.gameStarted) {
    socket.emit('roomDoesntExist');
    return;
  }
  let players = (await player.getPlayersInRoom(roomToCheck)).map(
    plr => plr.name,
  );
  if (players.includes(name)) {
    socket.emit('nameAlreadyExists');
    return;
  }

  console.log(`${name} is joining to room:${roomToCheck}`);
  socket.join(roomToCheck, () => {
    socket.emit('joinRoom', roomToCheck, false /*isHost*/);
    players.push(name);
    io.to(roomToCheck).emit('players', players);
    player.postPlayer({
      socket: socket.id,
      room: roomToCheck,
      name: name,
    });
  });
};

exports.onStart = async function (io, roomCode) {
  room.updateStartGameStatus(roomCode);

  let prob = await problem.getProblem();

  io.to(roomCode).emit('start', prob.text);
};

exports.onProblemSubmit = async function (io, socket, input, name, roomCode) {
  await player.updateProblem(input, name, roomCode);

  if (await player.allDone(roomCode)) {
    player.resetDone(roomCode);
    io.to(roomCode).emit('draw');
  } else {
    socket.emit('wait');
  }
};

exports.onDrawSubmit = async function (io, socket, drawProps, roomCode) {
  await player.updateDrawing(socket.id, drawProps);

  if (await player.allDone(roomCode)) {
    player.resetDone(roomCode);

    let drawings = (await player.getPlayersInRoom(roomCode)).map(plr => {
      let drw = Object.assign(
        {playerName: plr.name, problem: plr.problem},
        plr.drawing,
      );
      return drw;
    });
    io.to(roomCode).emit('present', drawings);
  } else {
    socket.emit('wait');
  }
};

exports.onNextStage = (io, roomCode) => io.to(roomCode).emit('nextStage');

exports.onNextPresentation = (io, roomCode) => io.to(roomCode).emit('nextPres');

exports.onPresentationComplete = (io, roomCode) => io.to(roomCode).emit('vote');

exports.onVoteSubmit = (name, roomCode) => player.upvoteDrawing(name, roomCode);

exports.onVotingDone = async function (io, name, roomCode) {
  await player.setDone(name, roomCode);

  if (await player.allDone(roomCode)) {
    player.resetDone(roomCode);
    let leaderboard = await player.getLeaderboard(roomCode);
    let winners = [];
    let i = 0;

    while (
      i < leaderboard.length &&
      leaderboard[i].votes === leaderboard[0].votes
    ) {
      winners.push(leaderboard[i].name);
      i++;
    }

    io.to(roomCode).emit('roundEnd', winners, leaderboard);
  }
};

exports.onDisconnect = async function (socket) {
  console.log('Client disconnected', socket.id);

  let plr = await player.getPlayerBySocket(socket.id);

  if (plr) {
    let PlayersInRoom = await player.getPlayersInRoom(plr.room);
    if (PlayersInRoom.length === 1) room.updateRoom(plr.room);
    player.removePlayer(socket.id);
  }
};
