const socketIo = require('socket.io');
const controller = require('../controllers/socket');
const sio = require('../io');

jest.mock('socket.io');
jest.mock('../controllers/socket');

const socket = {
  on: jest.fn((name, fn) => {
    fn();
  }),
};
const io = {
  on: jest.fn((name, fn) => {
    fn(socket);
  }),
};

socketIo.mockReturnValue(io);
console.log = jest.fn();

beforeEach(() => {
  sio();
});

describe('sio()', () => {
  test('should connect host', () => {
    expect(socket.on).toBeCalledWith('host', expect.any(Function));
    expect(controller.onHost).toBeCalled();
  });

  test('should connect join', () => {
    expect(socket.on).toBeCalledWith('join', expect.any(Function));
    expect(controller.onJoin).toBeCalled();
  });

  test('should connect start', () => {
    expect(socket.on).toBeCalledWith('start', expect.any(Function));
    expect(controller.onStart).toBeCalled();
  });

  test('should connect problemSubmit', () => {
    expect(socket.on).toBeCalledWith('problemSubmit', expect.any(Function));
    expect(controller.onProblemSubmit).toBeCalled();
  });

  test('should connect drwSubmit', () => {
    expect(socket.on).toBeCalledWith('drwSubmit', expect.any(Function));
    expect(controller.onDrawSubmit).toBeCalled();
  });

  test('should connect nextStage', () => {
    expect(socket.on).toBeCalledWith('nextStage', expect.any(Function));
    expect(controller.onNextStage).toBeCalled();
  });

  test('should connect nextPres', () => {
    expect(socket.on).toBeCalledWith('nextPres', expect.any(Function));
    expect(controller.onNextPresentation).toBeCalled();
  });

  test('should connect donePresenting', () => {
    expect(socket.on).toBeCalledWith('donePresenting', expect.any(Function));
    expect(controller.onPresentationComplete).toBeCalled();
  });

  test('should connect voteSubmit', () => {
    expect(socket.on).toBeCalledWith('voteSubmit', expect.any(Function));
    expect(controller.onVoteSubmit).toBeCalled();
  });

  test('should connect doneVoting', () => {
    expect(socket.on).toBeCalledWith('doneVoting', expect.any(Function));
    expect(controller.onVotingDone).toBeCalled();
  });

  test('should connect disconnect', () => {
    expect(socket.on).toBeCalledWith('disconnect', expect.any(Function));
    expect(controller.onDisconnect).toBeCalled();
  });
});

afterAll(() => {
  console.log.mockReset();
  socketIo.mockReset();
});
