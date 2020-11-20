const {db} = require('../../models');
const {getAvailableRoom, updateRoom} = require('../room');

jest.mock('../../models');

db.Room.aggregate.mockResolvedValue([{code: 'ASS', active: true}]);
db.Room.updateOne.mockResolvedValue();

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
