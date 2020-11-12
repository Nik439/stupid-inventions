const socketIo = require("socket.io");
const player = require('./controllers/player');
const room = require('./controllers/room');
const problem = require('./controllers/problem');

async function sio(server) {
  const io = socketIo(server);

  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    socket.on('host', async (name) => {
      let rm = await room.getAvailableRoom();
      console.log('host on room:', rm);
      socket.join(rm.code);
      socket.emit('joinRoom', rm.code, true /*isHost*/ );
      player.postPlayer({
        socket: socket.id,
        room: rm.code,
        name: name,
      });
      socket.emit('players', [name])
    });

    socket.on('join', async (roomToCheck, name) => {
      let players = (await player.getPlayersInRoom(roomToCheck)).map(plr => plr.name);
      if (players.length > 0) { //room exists
        if (!players.includes(name)) { // new player
          socket.join(roomToCheck, () => {
            socket.emit('joinRoom', roomToCheck, false /*isHost*/ );
            players.push(name);
            io.to(roomToCheck).emit('players', players)
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

  });
}

module.exports = sio;
