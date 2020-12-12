require('dotenv').config();
const createApp = require('./app');
const http = require('http');
const sio = require('./io');
const {startDb} = require('./models');
const config = require('./config');

const port = process.env.PORT || config.port;

function main() {
  const app = createApp();

  const server = http.createServer(app);

  sio(server);

  startDb().then(() => {
    server.listen(port, () => console.log(`Listening on port ${port}`));
  });
}
main();

module.exports = createApp;
