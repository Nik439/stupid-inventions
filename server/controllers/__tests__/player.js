const {db} = require('../../models');
const mocks = require('../__mocks__/mocks');
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

db.Player.find.mockResolvedValue(mocks.data.mockPlayers);
db.Player.updateOne.mockResolvedValue();
db.Player.updateMany.mockResolvedValue();
db.Player.findOne.mockResolvedValue(mocks.data.mockPlayer);
db.Player.deleteOne.mockResolvedValue();

const mockFn = jest.fn();
db.Player.mockImplementation(() => {
  return {
    save: mockFn,
  };
});

describe('postPlayer()', () => {
  test('should post a player', async () => {
    const res=await postPlayer(mocks.data.mockPlayer);

    expect(mockFn).toBeCalled();
    expect(res).toBe(mocks.data.mockPlayer);
  });
});

describe('getPlayersInRoom()', () => {
  test('getPlayersInRoom() should find players in a room', async () => {
    const res=await getPlayersInRoom(mocks.data.mockRoom)

    expect(db.Player.find).toBeCalledWith({room: mocks.data.mockRoom}, expect.any(Function));
    expect(res).toBe(mocks.data.mockPlayers);
  });
});

describe('updateProblem()', () => {
  test('updateProblem() should change the problem for a specific player', async () => {
    const res=await updateProblem(mocks.data.mockProblem, mocks.data.mockName, mocks.data.mockRoom)
    
    expect(db.Player.updateOne).toBeCalledWith(
      {name: mocks.data.mockName, room: mocks.data.mockRoom},
      {$set: {problem: mocks.data.mockProblem, done: true}},);
  });
});

describe('setDone()', () => {
  test('setDone() should update one players done status', async () => {
    await setDone(mocks.data.mockName, mocks.data.mockRoom)
    
    expect(db.Player.updateOne).toBeCalledWith({name: mocks.data.mockName, room: mocks.data.mockRoom}, {$set: {done: true}});
  });
});

describe('allDone()', () => {
  test('allDone() should return false when not all players are done', async () => {
    const res=await allDone(mocks.data.mockRoom)
    
    expect(db.Player.find).toBeCalledWith({room: mocks.data.mockRoom});
    expect(res).toBe(false);
  });

  test('allDone() should return true when all players are done', async () => {
    const mockPlayers=[
      { 
        votes:0,
        done:true,
        socket:mocks.data.mockSocket,
        room:mocks.data.mockRoom,
        name:'Jill',
        problem:mocks.data.mockProblem},
      {
      votes:1,
      done:true,
      socket:mocks.data.mockSocket,
      room:mocks.data.mockRoom,
      name:'John',
      problem:'I want to drive and B, at the same time'}]
    db.Player.find.mockResolvedValue(mockPlayers);

    const res=await allDone(mocks.data.mockRoom)
    
    expect(db.Player.find).toBeCalledWith({room: mocks.data.mockRoom});
    expect(res).toBe(true);
  });
});

describe('allDone()', () => {
  test('resetDone() updates done for an entire room', async () => {
    await resetDone(mocks.data.mockRoom)
    
    expect(db.Player.updateMany).toBeCalledWith({room: mocks.data.mockRoom}, {$set: {done: false}});
  });
});

describe('updateDrawing()', () => {
  test('updateDrawing() sets the drawing for one player', async () => {
    await updateDrawing(mocks.data.mockSocket,mocks.data.mockDrawing);
    
    expect(db.Player.updateOne).toBeCalledWith({socket: mocks.data.mockSocket}, {$set: {drawing: mocks.data.mockDrawing, done: true}});
  });
});

describe('upvoteDrawing()', () => {
  test('upvoteDrawing() increases the vote for one player', async () => {
    await upvoteDrawing(mocks.data.mockName,mocks.data.mockRoom);
    
    expect(db.Player.updateOne).toBeCalledWith({name: mocks.data.mockName, room: mocks.data.mockRoom}, {$inc: {votes: 1}});
  });
});

describe('upvoteDrawing()', () => {
  test('getLeaderboard() gets players and sorts their names by score', async () => {
    const res=await getLeaderboard(mocks.data.mockRoom);

    expect(db.Player.find).toBeCalledWith({room: mocks.data.mockRoom});
    expect(res).toEqual([{
      name: 'Jill',
      votes: 0},
      {name: 'John',
      votes: 1}]);
  });
});

describe('getPlayerBySocket()', () => {
  test('getPlayerBySocket() gets players own info', async () => {
    const res=await getPlayerBySocket(mocks.data.mockSocket);
    
    expect(db.Player.findOne).toBeCalledWith({socket: mocks.data.mockSocket},expect.any(Function));
    expect(res).toEqual(mocks.data.mockPlayer);
  });
});

describe('getPlayerBySocket()', () => {
  test('removePlayer() deletes player', async () => {
    await removePlayer(mocks.data.mockSocket);
    
    expect(db.Player.deleteOne).toBeCalledWith({socket: mocks.data.mockSocket},expect.any(Function));
  });
});

afterAll(() => {
  db.Player.find.mockReset();
  db.Player.updateOne.mockReset();
  db.Player.updateMany.mockReset();
  db.Player.findOne.mockReset();
  db.Player.deleteOne.mockReset();
});
