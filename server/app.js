const express = require('express');
const path = require('path');

function createApp() {
  const app = express();
  app.use(express.static(path.join(__dirname, '/../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/../client/build/index.html'));
  });

  return app;
}

module.exports = createApp;
