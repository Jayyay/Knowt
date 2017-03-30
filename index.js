const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/hello-world', (req, res) => {
  res.send('hello world');
});

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

// ## CORS middleware
// see: http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, api_key, Origin, X-Requested-With, Accept');

  // intercept OPTIONS method
  if (req.method == 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
};
app.use(allowCrossDomain);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
