const {db} = require('../../models');
const mocks = require('../__mocks__/mocks');
=======
const {
  getAvailableRoom,
  updateRoom,
  checkRoomStatus,
  updateStartGameStatus,
} = require('../room');


jest.mock('../../models');

db.Room.aggregate.mockResolvedValue([{code: mocks.data.mockRoom, active: true}]);
db.Room.updateOne.mockResolvedValue();
db.Room.findOne.mockResolvedValue({
  active: true,
  gameStarted: false,
  code: mocks.data.mockRoom
});

describe('getAvailableRoom()', () => {
  test('should get an inactive room', async () => {
    await getAvailableRoom();

    expect(db.Room.aggregate).toBeCalledWith([
      {$match: {active: false}},
      {$sample: {size: 1}},
    ]);
  });

  test('should return active the room', async () => {
    const room = await getAvailableRoom();
    expect(room.code).toBe(mocks.data.mockRoom);
    expect(room.active).toBe(true);
  });
});

describe('updateRoom()', () => {
  test('should close the room', async () => {
    await updateRoom(mocks.data.mockRoom);

    expect(db.Room.updateOne).toBeCalledWith(
      {code: mocks.data.mockRoom},
      {$set: {active: false}},
    );
  });
});

describe('checkRoomStatus()', () => {
  test('should return the data for the room', async () => {
    const res=await checkRoomStatus(mocks.data.mockRoom);

    expect(db.Room.findOne).toBeCalledWith({code: mocks.data.mockRoom});
    expect(res).toEqual({active: true,gameStarted: false,code: mocks.data.mockRoom});
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
