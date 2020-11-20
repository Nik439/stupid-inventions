const {db} = require('../../models');
const {getProblem} = require('../problem');

jest.mock('../../models');

db.Problem.aggregate.mockResolvedValue(['1', '2']);

describe('getProblem()', () => {
  test('should get a single problem', async () => {
    await getProblem();

    expect(db.Problem.aggregate).toBeCalledWith([{$sample: {size: 1}}]);
  });

  test('should return the first result', async () => {
    const res = await getProblem();

    expect(res).toBe('1');
  });
});

afterAll(() => {
  db.Problem.aggregate.mockReset();
});
