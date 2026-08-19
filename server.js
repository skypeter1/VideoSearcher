'use strict';

require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();
const PORT = Number(process.env.PORT) || 8080;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';

app.get('/config.js', function (req, res) {
  res.type('application/javascript');
  res.send(
    'window.YOUTUBE_API_KEY=' + JSON.stringify(YOUTUBE_API_KEY) + ';\n'
  );
});

app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'app')));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'app', 'index.html'));
});

app.listen(PORT, function () {
  console.log('VideoSearcher listening on http://localhost:' + PORT + '/');
  if (!YOUTUBE_API_KEY) {
    console.warn(
      'Warning: YOUTUBE_API_KEY is not set. Copy .env.example to .env and add your key.'
    );
  }
});
