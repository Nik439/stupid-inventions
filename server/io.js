const socketIo = require('socket.io');
const socketController = require('./controllers/socket');

async function sio(server) {
  const io = socketIo(server);

  io.on('connection', socket => {
    console.log('New client connected', socket.id);

    socket.on(
      'host',
      async name => await socketController.onHost(socket, name),
    );

    socket.on(
      'join',
      async (roomToCheck, name) =>
        await socketController.onJoin(io, socket, roomToCheck, name),
    );

    socket.on(
      'start',
      async roomCode => await socketController.onStart(io, roomCode),
    );

    socket.on(
      'problemSubmit',
      async (input, name, roomCode) =>
        await socketController.onProblemSubmit(
          io,
          socket,
          input,
          name,
          roomCode,
        ),
    );

    socket.on(
      'drwSubmit',
      async (drwProps, roomCode) =>
        await socketController.onDrawSubmit(io, socket, drwProps, roomCode),
    );

    socket.on('nextStage', roomCode =>
      socketController.onNextStage(io, roomCode),
    );

    socket.on('nextPres', roomCode =>
      socketController.onNextPresentation(io, roomCode),
    );

    socket.on('donePresenting', roomCode =>
      socketController.onPresentationComplete(io, roomCode),
    );

    socket.on('voteSubmit', (name, roomCode) =>
      socketController.onVoteSubmit(name, roomCode),
    );

    socket.on(
      'doneVoting',
      async (name, roomCode) =>
        await socketController.onVotingDone(io, name, roomCode),
    );

    socket.on(
      'disconnect',
      async () => await socketController.onDisconnect(socket),
    );
  });
}

module.exports = sio;
