const {db} = require('../../models');
const {
  getAvailableRoom,
  updateRoom,
  checkRoomStatus,
  updateStartGameStatus,
} = require('../room');

jest.mock('../../models');

db.Room.aggregate.mockResolvedValue([{code: 'ASS', active: true}]);
db.Room.updateOne.mockResolvedValue();
db.Room.findOne.mockResolvedValue({
  active: true,
  gameStarted: false,
  code: 'ASS',
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
    expect(room.code).toBe('ASS');
    expect(room.active).toBe(true);
  });
});

describe('updateRoom()', () => {
  test('should close the room', async () => {
    await updateRoom('ASS');

    expect(db.Room.updateOne).toBeCalledWith(
      {code: 'ASS'},
      {$set: {active: false}},
    );
  });
});

describe('checkRoomStatus()', () => {
  test('should return the data for the room', async () => {
    const res = await checkRoomStatus('ASS');

    expect(db.Room.findOne).toBeCalledWith({code: 'ASS'});
    expect(res).toEqual({active: true, gameStarted: false, code: 'ASS'});
  });
});

describe('updateStartGameStatus()', () => {
  test('should set the start status of the game to true', async () => {
    const res = await updateStartGameStatus('ASS');

    expect(db.Room.updateOne).toBeCalledWith(
      {code: 'ASS'},
      {$set: {gameStarted: true}},
    );
  });
});

afterAll(() => {
  db.Room.aggregate.mockReset();
  db.Room.updateOne.mockReset();
  db.Room.findOne.mockReset();
});
