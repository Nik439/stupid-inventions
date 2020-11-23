const controller = require('../socket');
const room = require('../room');
const player = require('../player');
const problem = require('../problem');

jest.mock('../room');
jest.mock('../player');
jest.mock('../problem');

console.log = jest.fn();

room.getAvailableRoom.mockResolvedValue({code: 'ASS'});
player.getPlayersInRoom.mockResolvedValue([
  {name: 'test', problem: 'a', drawing: 'a'},
]);
problem.getProblem.mockResolvedValue({text: 'a'});

describe('onHost', () => {
  const socket = {
    join: jest.fn(),
    emit: jest.fn(),
  };

  test('should join the correct socket room', async () => {
    await controller.onHost(socket, 'test');
    expect(socket.join).toBeCalledWith('ASS');
  });

  test('should emit joinRoom as host', async () => {
    await controller.onHost(socket, 'test');
    expect(socket.emit).toBeCalledWith('joinRoom', 'ASS', true);
  });

  test('should emit players', async () => {
    socket.emit.mockClear();

    await controller.onHost(socket, 'test');

    expect(socket.emit).toBeCalledWith('players', ['test']);
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

  test('should emit roomDoesntExists if the room is not active', async () => {
    room.checkRoomStatus.mockResolvedValue({active: false});

    await controller.onJoin(io, socket, 'ASS', 'test');

    expect(socket.emit).toBeCalledWith('roomDoesntExist');
  });

  test('should not allow joining to a started room', async () => {
    room.checkRoomStatus.mockResolvedValue({active: true, gameStarted: true});

    socket.emit.mockClear();
    await controller.onJoin(io, socket, 'ASS', 'test');

    expect(socket.emit).toBeCalledWith('roomDoesntExist');
  });

  test('should not allow existing names', async () => {
    room.checkRoomStatus.mockResolvedValue({active: true, gameStarted: false});

    socket.emit.mockClear();
    await controller.onJoin(io, socket, 'ASS', 'test');

    expect(socket.emit).toBeCalledWith('nameAlreadyExists');
  });

  test('should add the player to the room', async () => {
    socket.emit.mockClear();
    io.to.mockClear();
    emit.mockClear();
    await controller.onJoin(io, socket, 'ASS', 'a');

    expect(socket.join).toBeCalledWith('ASS', expect.any(Function));
    expect(socket.emit).toBeCalledWith('joinRoom', 'ASS', false);
    expect(io.to).toBeCalledWith('ASS');
    expect(emit).toBeCalledWith('players', ['test', 'a']);
    expect(player.postPlayer).toBeCalledWith({
      socket: '1',
      room: 'ASS',
      name: 'a',
    });
  });
});

describe('onStart', () => {
  const emit = jest.fn();

  const io = {
    to: jest.fn(() => ({emit})),
  };

  test('should update room game status', async () => {
    await controller.onStart(io, 'ASS');

    expect(room.updateStartGameStatus).toBeCalledWith('ASS');
  });

  test('should get a problem', async () => {
    await controller.onStart(io, 'ASS');

    expect(problem.getProblem).toBeCalled();
  });

  test('should emit start to the room', async () => {
    emit.mockClear();
    io.to.mockClear();
    await controller.onStart(io, 'ASS');

    expect(io.to).toBeCalledWith('ASS');
    expect(emit).toBeCalledWith('start', 'a');
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
    await controller.onProblemSubmit(io, socket, 'a', 'test', 'ASS');

    expect(player.updateProblem).toBeCalledWith('a', 'test', 'ASS');
  });

  test('should emit wait if players are not done', async () => {
    player.allDone.mockResolvedValue(false);

    await controller.onProblemSubmit(io, socket, 'a', 'test', 'ASS');

    expect(socket.emit).toBeCalledWith('wait');
  });

  test('should switch to draw when all players are done', async () => {
    player.allDone.mockResolvedValue(true);

    await controller.onProblemSubmit(io, socket, 'a', 'test', 'ASS');

    expect(io.to).toBeCalledWith('ASS');
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
    await controller.onDrawSubmit(io, socket, {}, 'ASS');

    expect(player.updateDrawing).toBeCalled();
  });

  test('should emit wait if players are not done', async () => {
    player.allDone.mockResolvedValue(false);

    await controller.onDrawSubmit(io, socket, {}, 'ASS');

    expect(socket.emit).toBeCalledWith('wait');
  });

  test('should present drawings if all players are done', async () => {
    player.allDone.mockResolvedValue(true);

    await controller.onDrawSubmit(io, socket, {}, 'ASS');

    expect(io.to).toBeCalledWith('ASS');
    expect(emit).toBeCalledWith('present', expect.any(Object));
  });
});

afterAll(() => {
  room.getAvailableRoom.mockReset();
  room.checkRoomStatus.mockReset();
  player.getPlayersInRoom.mockReset();
  player.allDone.mockReset();
  problem.getProblem.mockReset();
  console.log.mockReset();
});
