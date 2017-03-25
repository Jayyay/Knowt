const express = require('express');

const app = express();

app.get('/', (req, res) => {
  // res.send('hello world');
  res.redirect('/dist/index.html');
});

module.exports = app;
