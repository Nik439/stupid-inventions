const socketIo = require('socket.io');
const player = require('./controllers/player');
const room = require('./controllers/room');
const problem = require('./controllers/problem');

async function sio (server) {
  const io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    socket.on('host', async (name) => {
      let rm = await room.getAvailableRoom();
      console.log('Hosting on room:', rm.code);
      socket.join(rm.code);
      socket.emit('joinRoom', rm.code, true /*isHost*/ );
      player.postPlayer({
        socket: socket.id,
        room: rm.code,
        name: name,
      });
      socket.emit('players', [name]);
    });

    socket.on('join', async (roomToCheck, name) => {
      let players = (await player.getPlayersInRoom(roomToCheck)).map(plr => plr.name);
      if (players.length > 0) { //room exists
        if (!players.includes(name)) { // new player
          console.log('Joining on room:', roomToCheck);
          socket.join(roomToCheck, () => {
            socket.emit('joinRoom', roomToCheck, false /*isHost*/ );
            players.push(name);
            io.to(roomToCheck).emit('players', players);
            player.postPlayer({
              socket: socket.id,
              room: roomToCheck,
              name: name,
            });
          });
        } else { //player already in room
          socket.emit('nameAlreadyExists');
        }
      } else {//room doesn't exist
        socket.emit('roomDoesntExist');
      }
    });

    socket.on('start', async (roomCode) => {
      let prob = await problem.getProblem();
      io.to(roomCode).emit('start', prob.text);
    });

    socket.on('problemSubmit', async (input, name, roomCode) => {
      await player.updateProblem(input, name, roomCode);
      if (await player.allDone(roomCode)) {
        player.resetDone(roomCode);
        io.to(roomCode).emit('draw');
      } else {
        socket.emit('wait');
      }
    });

    socket.on('drwSubmit', async (drwProps, roomCode) => {
      await player.updateDrawing(socket.id, drwProps);
      if (await player.allDone(roomCode)) {
        player.resetDone(roomCode);
        let drawings = (await player.getPlayersInRoom(roomCode)).map(plr => {
          let drw = Object.assign({playerName: plr.name, problem: plr.problem}, plr.drawing);
          return drw;
        });
        io.to(roomCode).emit('present', drawings);
      } else {
        socket.emit('wait');
      }
    });

    socket.on('nextStage', roomCode => {
      io.to(roomCode).emit('nextStage');
    });
    socket.on('nextPres', roomCode => {
      io.to(roomCode).emit('nextPres');
    });
    socket.on('donePresenting', roomCode => {
      io.to(roomCode).emit('vote');
    });

    socket.on('voteSubmit', (name, roomCode) => {
      player.upvoteDrawing(name, roomCode);
    });
    socket.on('doneVoting', async (name, roomCode) => {
      await player.setDone(name, roomCode);
      if (await player.allDone(roomCode)) {
        player.resetDone(roomCode);
        let leaderboard = await player.getLeaderboard(roomCode);
        let winners = [];
        let i = 0;
        while (i<leaderboard.length && leaderboard[i].votes === leaderboard[0].votes) {
          winners.push(leaderboard[i].name);
          i++;
        }
        io.to(roomCode).emit('roundEnd', winners, leaderboard);
      }
    });

    socket.on('disconnect', async () => {
      console.log('Client disconnected', socket.id);
      let plr = await player.getPlayerBySocket(socket.id);
      if (plr) {
        let PlayersInRoom = await player.getPlayersInRoom(plr.room);
        if (PlayersInRoom.length === 1) room.updateRoom(plr.room);
        player.removePlayer(socket.id);
      }
    });

  });
}

module.exports = sio;
