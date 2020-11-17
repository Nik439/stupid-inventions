const express = require('express');
const path = require('path');
const http = require('http');
const sio = require('./io');
const startDb = require('./db');

const port = process.env.PORT || 5000;

const app = express();
app.use(express.static(path.join(__dirname, '/../client/build')));

app.get('/test', (req, res) => {
  res.json({'hi':'HI'});
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/../client/build/index.html'));
});

const server = http.createServer(app);

sio(server);

// startDb().then(() => {
//   server.listen(port, () => console.log(`Listening on port ${port}`));
// });

server.listen(port, () => console.log(`Listening on port ${port}`));