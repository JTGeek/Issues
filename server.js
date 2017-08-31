require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
// const fetchUrl = require("fetch").fetchUrl;
const {
  router: usersRouter
} = require('./users');
const {
  router: authRouter,
  basicStrategy,
  jwtStrategy
} = require('./auth');
const {
  router: catalogRouter
} = require('./catalog');

mongoose.Promise = global.Promise;

const {
  PORT,
  DATABASE_URL
} = require('./config');

const app = express();

// Logging
app.use(morgan('common'));

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

app.use(passport.initialize());
passport.use(basicStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);
app.use('/api/catalog/', catalogRouter);

// app.get('/test', (req, res) => {
//   console.log("is working");
//   let url = 'http://api.comicvine.com/issues/?api_key=811257a1a6ca2c21707f7ad0207533f431883722&format=json&filter=title:hellboy';
//   fetchUrl(url, function (error, meta, body) {
//     res.send(body)
//     //res.status(201).json(body);
//   })


// })

// A protected endpoint which needs a valid JWT to access it
app.get('/api/protected',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    return res.json({
      data: 'user issues obj' // replace with user values for input into CV_API on search.jsks
    });
  }
);

app.use('*', (req, res) => {
  return res.status(404).json({
    message: 'Not Found'
  });
});

// Referenced by both runServer and closeServer. closeServer
// assumes runServer has run and set `server` to a server object
let server;

function runServer() {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(PORT, () => {
          console.log(`Your app is listening on port ${PORT}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {
  app,
  runServer,
  closeServer
};