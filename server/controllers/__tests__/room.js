const {db} = require('../../models');
const mocks = require('../__mocks__/mocks');
const {
  getAvailableRoom,
  updateRoom,
  checkRoomStatus,
  updateStartGameStatus,
} = require('../room');

jest.mock('../../models');

db.Room.updateOne.mockResolvedValue();
db.Room.deleteOne.mockResolvedValue(true);
db.Room.findOne.mockResolvedValue(null);
db.Room.create.mockResolvedValue({
  code: mocks.data.mockRoom,
  gameStarted: false,
});
const mockMath = Object.create(global.Math);
mockMath.random = () => 1;
global.Math = mockMath;

describe('getAvailableRoom()', () => {
  test('should get an inactive room code', async () => {
    await getAvailableRoom();

    expect(db.Room.findOne).toBeCalledWith({code: mocks.data.mockRoom});

    expect(db.Room.create).toBeCalledWith({code: mocks.data.mockRoom});
  });

  test('should return the room', async () => {
    const room = await getAvailableRoom();
    expect(room.code).toBe(mocks.data.mockRoom);
    expect(room.gameStarted).toBe(false);
  });
});

describe('updateRoom()', () => {
  test('should close the room', async () => {
    await updateRoom(mocks.data.mockRoom);

    expect(db.Room.deleteOne).toBeCalledWith(
      {code: mocks.data.mockRoom},
      expect.any(Function),
    );
  });
});

describe('checkRoomStatus()', () => {
  test('should return the data for the room', async () => {
    db.Room.findOne.mockResolvedValue({
      gameStarted: false,
      code: mocks.data.mockRoom,
    });

    const res = await checkRoomStatus(mocks.data.mockRoom);

    expect(db.Room.findOne).toBeCalledWith({code: mocks.data.mockRoom});
    expect(res).toEqual({gameStarted: false, code: mocks.data.mockRoom});
  });
});

describe('updateStartGameStatus()', () => {
  test('should set the start status of the game to true', async () => {
    await updateStartGameStatus(mocks.data.mockRoom);

    expect(db.Room.updateOne).toBeCalledWith(
      {code: mocks.data.mockRoom},
      {$set: {gameStarted: true}},
    );
  });
});

afterAll(() => {
  db.Room.aggregate.mockReset();
  db.Room.updateOne.mockReset();
  db.Room.findOne.mockReset();
});
