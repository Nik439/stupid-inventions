const controller = require('../socket');
const room = require('../room');
const player = require('../player');
const problem = require('../problem');
const mocks = require('../__mocks__/mocks');

jest.mock('../room');
jest.mock('../player');
jest.mock('../problem');

console.log = jest.fn();

room.getAvailableRoom.mockResolvedValue({code: mocks.data.mockRoom});
player.getPlayersInRoom.mockResolvedValue([
  {
    name: mocks.data.mockName,
    problem: mocks.data.mockProblem,
    drawing: mocks.data.mockDrawing,
  },
]);
problem.getProblem.mockResolvedValue({text: mocks.data.mockProblem});
player.getLeaderboard.mockResolvedValue([
  {votes: 3, name: mocks.data.mockName},
]);
player.getPlayerBySocket.mockResolvedValue({room: mocks.data.mockRoom});

describe('onHost', () => {
  const socket = {
    join: jest.fn(),
    emit: jest.fn(),
  };

  test('should join the correct socket room', async () => {
    await controller.onHost(socket, mocks.data.mockName);
    expect(socket.join).toBeCalledWith(mocks.data.mockRoom);
  });

  test('should emit joinRoom as host', async () => {
    await controller.onHost(socket, mocks.data.mockName);
    expect(socket.emit).toBeCalledWith('joinRoom', mocks.data.mockRoom, true);
  });

  test('should emit players', async () => {
    socket.emit.mockClear();

    await controller.onHost(socket, mocks.data.mockName);

    expect(socket.emit).toBeCalledWith('players', [mocks.data.mockName]);
  });
});

describe('onJoin', () => {
  const socket = {
    join: jest.fn((room, fn) => fn()),
    emit: jest.fn(),
    id: '1',
  };

  const emit = jest.fn();

  const io = {
    to: jest.fn(() => ({emit})),
  };

  test('should emit roomDoesntExists if the room doesnt exist', async () => {
    room.checkRoomStatus.mockResolvedValue();

    await controller.onJoin(
      io,
      socket,
      mocks.data.mockRoom,
      mocks.data.mockName,
    );

    expect(socket.emit).toBeCalledWith('roomDoesntExist');
  });

  test('should not allow joining to a started room', async () => {
    room.checkRoomStatus.mockResolvedValue({active: true, gameStarted: true});

    socket.emit.mockClear();
    await controller.onJoin(
      io,
      socket,
      mocks.data.mockRoom,
      mocks.data.mockName,
    );

    expect(socket.emit).toBeCalledWith('roomDoesntExist');
  });

  test('should not allow existing names', async () => {
    room.checkRoomStatus.mockResolvedValue({active: true, gameStarted: false});

    socket.emit.mockClear();
    await controller.onJoin(
      io,
      socket,
      mocks.data.mockRoom,
      mocks.data.mockName,
    );

    expect(socket.emit).toBeCalledWith('nameAlreadyExists');
  });

  test('should add the player to the room', async () => {
    room.checkRoomStatus.mockResolvedValue({active: true, gameStarted: false});
    socket.emit.mockClear();
    io.to.mockClear();
    emit.mockClear();
    await controller.onJoin(io, socket, mocks.data.mockRoom, 'Jill');

    expect(socket.join).toBeCalledWith(
      mocks.data.mockRoom,
      expect.any(Function),
    );
    expect(socket.emit).toBeCalledWith('joinRoom', mocks.data.mockRoom, false);
    expect(io.to).toBeCalledWith(mocks.data.mockRoom);
    expect(emit).toBeCalledWith('players', [mocks.data.mockName, 'Jill']);
    expect(player.postPlayer).toBeCalledWith({
      socket: '1',
      room: mocks.data.mockRoom,
      name: 'Jill',
    });
  });
});

describe('onStart', () => {
  const emit = jest.fn();

  const io = {
    to: jest.fn(() => ({emit})),
  };

  test('should update room game status', async () => {
    await controller.onStart(io, mocks.data.mockRoom);

    expect(room.updateStartGameStatus).toBeCalledWith(mocks.data.mockRoom);
  });

  test('should get a problem', async () => {
    await controller.onStart(io, mocks.data.mockRoom);

    expect(problem.getProblem).toBeCalled();
  });

  test('should emit start to the room', async () => {
    emit.mockClear();
    io.to.mockClear();
    await controller.onStart(io, mocks.data.mockRoom);

    expect(io.to).toBeCalledWith(mocks.data.mockRoom);
    expect(emit).toBeCalledWith('start', mocks.data.mockProblem);
  });
});

describe('onProblemSubmit', () => {
  const socket = {
    join: jest.fn((room, fn) => fn()),
    emit: jest.fn(),
    id: '1',
  };

  const emit = jest.fn();

  const io = {
    to: jest.fn(() => ({emit})),
  };

  test('should update the player problem', async () => {
    await controller.onProblemSubmit(
      io,
      socket,
      mocks.data.mockProblem,
      mocks.data.mockName,
      mocks.data.mockRoom,
    );

    expect(player.updateProblem).toBeCalledWith(
      mocks.data.mockProblem,
      mocks.data.mockName,
      mocks.data.mockRoom,
    );
  });

  test('should emit wait if players are not done', async () => {
    player.allDone.mockResolvedValue(false);

    await controller.onProblemSubmit(
      io,
      socket,
      mocks.data.mockProblem,
      mocks.data.mockName,
      mocks.data.mockRoom,
    );

    expect(socket.emit).toBeCalledWith('wait');
  });

  test('should switch to draw when all players are done', async () => {
    player.allDone.mockResolvedValue(true);

    await controller.onProblemSubmit(
      io,
      socket,
      mocks.data.mockProblem,
      mocks.data.mockName,
      mocks.data.mockRoom,
    );

    expect(io.to).toBeCalledWith(mocks.data.mockRoom);
    expect(emit).toBeCalledWith('draw');
  });
});

describe('onDrawSubmit', () => {
  const socket = {
    join: jest.fn((room, fn) => fn()),
    emit: jest.fn(),
    id: '1',
  };

  const emit = jest.fn();

  const io = {
    to: jest.fn(() => ({emit})),
  };

  test('should update drawing', async () => {
    await controller.onDrawSubmit(io, socket, {}, mocks.data.mockRoom);

    expect(player.updateDrawing).toBeCalled();
  });

  test('should emit wait if players are not done', async () => {
    player.allDone.mockResolvedValue(false);

    await controller.onDrawSubmit(io, socket, {}, mocks.data.mockRoom);

    expect(socket.emit).toBeCalledWith('wait');
  });

  test('should present drawings if all players are done', async () => {
    player.allDone.mockResolvedValue(true);

    await controller.onDrawSubmit(io, socket, {}, mocks.data.mockRoom);

    expect(io.to).toBeCalledWith(mocks.data.mockRoom);
    expect(emit).toBeCalledWith('present', expect.any(Object));
  });
});

test('onNextStage should emit nextStage on stage change', async () => {
  const emit = jest.fn();

  const io = {
    to: jest.fn(() => ({emit})),
  };

  await controller.onNextStage(io, mocks.data.mockRoom);

  expect(io.to).toBeCalledWith(mocks.data.mockRoom);
  expect(emit).toBeCalledWith('nextStage');
});

test('onNextPresentation should emit nextPres on pres change', async () => {
  const emit = jest.fn();

  const io = {
    to: jest.fn(() => ({emit})),
  };

  await controller.onNextPresentation(io, mocks.data.mockRoom);

  expect(io.to).toBeCalledWith(mocks.data.mockRoom);
  expect(emit).toBeCalledWith('nextPres');
});

test('onPresentationComplete should emit vote on pres complete', async () => {
  const emit = jest.fn();

  const io = {
    to: jest.fn(() => ({emit})),
  };

  await controller.onPresentationComplete(io, mocks.data.mockRoom);

  expect(io.to).toBeCalledWith(mocks.data.mockRoom);
  expect(emit).toBeCalledWith('vote');
});

test('onVoteSubmit should upvote drawing on vote', async () => {
  await controller.onVoteSubmit(mocks.data.mockName, mocks.data.mockRoom);

  expect(player.upvoteDrawing).toBeCalledWith(
    mocks.data.mockName,
    mocks.data.mockRoom,
  );
});

describe('onVotingDone', () => {
  const emit = jest.fn();

  const io = {
    to: jest.fn(() => ({emit})),
  };

  test('should set players done', async () => {
    await controller.onVotingDone(io, mocks.data.mockName, mocks.data.mockRoom);

    expect(player.setDone).toBeCalledWith(
      mocks.data.mockName,
      mocks.data.mockRoom,
    );
  });

  test('should emit roundEnd with correct winners', async () => {
    await controller.onVotingDone(io, mocks.data.mockName, mocks.data.mockRoom);

    expect(io.to).toBeCalledWith(mocks.data.mockRoom);
    expect(emit).toBeCalledWith(
      'roundEnd',
      [mocks.data.mockName],
      [{votes: 3, name: mocks.data.mockName}],
    );
  });
});

test('onDisconnect should get the player by socket', async () => {
  await controller.onDisconnect({id: 1});

  expect(player.getPlayerBySocket).toBeCalledWith(1);
  expect(player.getPlayersInRoom).toBeCalledWith(mocks.data.mockRoom);
  expect(room.updateRoom).toBeCalledWith(mocks.data.mockRoom);
  expect(player.removePlayer).toBeCalledWith(1);
});

afterAll(() => {
  room.getAvailableRoom.mockReset();
  room.checkRoomStatus.mockReset();
  player.getPlayersInRoom.mockReset();
  player.allDone.mockReset();
  player.getLeaderboard.mockReset();
  problem.getProblem.mockReset();
  console.log.mockReset();
});
