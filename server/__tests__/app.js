const supertest = require('supertest');
const createApp = require('../app');

const app = createApp();
const request = supertest(app);

describe('App', () => {
  test('all routes should return the React app', async () => {
    let res = await request.get('/');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatchInlineSnapshot(
      `"text/html; charset=UTF-8"`,
    );
    expect(res.text).toMatchSnapshot();

    res = await request.get('/anything');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatchInlineSnapshot(
      `"text/html; charset=UTF-8"`,
    );
    expect(res.text).toMatchSnapshot();
  });
});
