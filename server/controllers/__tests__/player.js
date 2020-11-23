const {db} = require('../../models');
const {
  postPlayer,
  getPlayersInRoom,
  updateProblem,
  setDone,
  allDone,
  resetDone,
  updateDrawing,
  upvoteDrawing,
  getLeaderboard,
  getPlayerBySocket,
  removePlayer} = require('../player');

jest.mock('../../models');


const mockRoom='ASS';
const mockProblem='I want to drive and A, at the same time';
const mockName='John';
const mockDrawing={
  name:'inventionName',
  url:'data'
}
const mockSocket='a1bc2DEFGhiJkL3MNOPQ';
const mockPlayer={
  votes:0,
  done:false,
  socket:mockSocket,
  room:mockRoom,
  name:'Jill',
  problem:mockProblem}
const mockPlayers=[
  mockPlayer,
  {
  votes:1,
  done:true,
  socket:mockSocket,
  room:mockRoom,
  name:'John',
  problem:'I want to drive and B, at the same time'}]

db.Player.find.mockResolvedValue(mockPlayers);
db.Player.updateOne.mockResolvedValue();
db.Player.updateMany.mockResolvedValue();
db.Player.findOne.mockResolvedValue(mockPlayer);
db.Player.deleteOne.mockResolvedValue();

const mockFn = jest.fn();
db.Player.mockImplementation(() => {
  return {
    save: mockFn,
  };
});

describe('postPlayer()', () => {
  test('should post a player', async () => {
    const res=await postPlayer(mockPlayer);

    expect(mockFn).toBeCalled();
    expect(res).toBe(mockPlayer);
  });

  test('getPlayersInRoom() should find players in a room', async () => {
    const res=await getPlayersInRoom(mockRoom)

    expect(db.Player.find).toBeCalledWith({room: mockRoom}, expect.any(Function));
    expect(res).toBe(mockPlayers);
  });

  test('updateProblem() should change the problem for a specific player', async () => {
    const res=await updateProblem(mockProblem, mockName, mockRoom)

    expect(db.Player.updateOne).toBeCalledWith(
      {name: mockName, room: mockRoom},
      {$set: {problem: mockProblem, done: true}},);
  });

  test('setDone() should update one players done status', async () => {
    await setDone(mockName, mockRoom)

    expect(db.Player.updateOne).toBeCalledWith({name: mockName, room: mockRoom}, {$set: {done: true}});
  });

  test('allDone() should return false when not all players are done', async () => {
    const res=await allDone(mockRoom)

    expect(db.Player.find).toBeCalledWith({room: mockRoom});
    expect(res).toBe(false);
  });

  test('resetDone() updates done for an entire room', async () => {
    await resetDone(mockRoom)

    expect(db.Player.updateMany).toBeCalledWith({room: mockRoom}, {$set: {done: false}});
  });

  test('updateDrawing() sets the drawing for one player', async () => {
    await updateDrawing(mockSocket,mockDrawing);

    expect(db.Player.updateOne).toBeCalledWith({socket: mockSocket}, {$set: {drawing: mockDrawing, done: true}});
  });

  test('upvoteDrawing() increases the vote for one player', async () => {
    await upvoteDrawing(mockName,mockRoom);

    expect(db.Player.updateOne).toBeCalledWith({name: mockName, room: mockRoom}, {$inc: {votes: 1}});
  });

  test('getLeaderboard() gets players and sorts their names by score', async () => {
    const res=await getLeaderboard(mockRoom);

    expect(db.Player.find).toBeCalledWith({room: mockRoom});
    expect(res).toEqual([{
      name: 'Jill',
      votes: 0},
      {name: 'John',
      votes: 1}]);
  });

  test('getPlayerBySocket() gets players own info', async () => {
    const res=await getPlayerBySocket(mockSocket);

    expect(db.Player.findOne).toBeCalledWith({socket: mockSocket},expect.any(Function));
    expect(res).toEqual(mockPlayer);
  });

  test('removePlayer() deletes player', async () => {
    await removePlayer(mockSocket);

    expect(db.Player.deleteOne).toBeCalledWith({socket: mockSocket},expect.any(Function));
  });
});

afterAll(() => {

});
