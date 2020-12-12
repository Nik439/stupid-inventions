const player = require('./player');
const room = require('./room');
const problem = require('./problem');

exports.onHost = async function (socket, name) {
  const available = await room.getAvailableRoom();

  console.log('Hosting on room:', available.code);

  socket.join(available.code);
  socket.emit('joinRoom', available.code, true /*isHost*/);

  player.postPlayer({
    socket: socket.id,
    room: available.code,
    name,
  });

  socket.emit('players', [name]);
};

exports.onJoin = async function (io, socket, code, name) {
  const roomData = await room.checkRoomStatus(code);

  if (!roomData || roomData.gameStarted) {
    socket.emit('roomDoesntExist');
    return;
  }

  const players = (await player.getPlayersInRoom(code)).map(plr => plr.name);
  if (players.includes(name)) {
    socket.emit('nameAlreadyExists');
    return;
  }

  console.log(`${name} is joining to room:${code}`);

  socket.join(code, () => {
    socket.emit('joinRoom', code, false /*isHost*/);

    players.push(name);

    io.to(code).emit('players', players);

    player.postPlayer({
      socket: socket.id,
      room: code,
      name,
    });
  });
};

exports.onStart = async function (io, code) {
  room.updateStartGameStatus(code);

  const prob = await problem.getProblem();

  io.to(code).emit('start', prob.text);
};

exports.onProblemSubmit = async function (io, socket, input, name, code) {
  await player.updateProblem(input, name, code);

  if (await player.allDone(code)) {
    player.resetDone(code);

    io.to(code).emit('draw');
  } else {
    socket.emit('wait');
  }
};

exports.onDrawSubmit = async function (io, socket, drawingData, code) {
  await player.updateDrawing(socket.id, drawingData);

  if (await player.allDone(code)) {
    player.resetDone(code);

    const drawings = (await player.getPlayersInRoom(code)).map(p => {
      return Object.assign({playerName: p.name, problem: p.problem}, p.drawing);
    });

    io.to(code).emit('present', drawings);
  } else {
    socket.emit('wait');
  }
};

exports.onNextStage = (io, code) => io.to(code).emit('nextStage');

exports.onNextPresentation = (io, code) => io.to(code).emit('nextPres');

exports.onPresentationComplete = (io, code) => io.to(code).emit('vote');

exports.onVoteSubmit = (name, code) => player.upvoteDrawing(name, code);

exports.onVotingDone = async function (io, name, code) {
  await player.setDone(name, code);

  if (await player.allDone(code)) {
    player.resetDone(code);
    const leaderboard = await player.getLeaderboard(code);
    const winners = [];
    let i = 0;

    while (
      i < leaderboard.length &&
      leaderboard[i].votes === leaderboard[0].votes
    ) {
      winners.push(leaderboard[i].name);
      i++;
    }

    io.to(code).emit('roundEnd', winners, leaderboard);
  }
};

exports.onDisconnect = async function (socket) {
  console.log('Client disconnected', socket.id);

  const p = await player.getPlayerBySocket(socket.id);

  if (p) {
    const pInRoom = await player.getPlayersInRoom(p.room);
    if (pInRoom.length === 1) room.updateRoom(p.room);
    player.removePlayer(socket.id);
  }
};
