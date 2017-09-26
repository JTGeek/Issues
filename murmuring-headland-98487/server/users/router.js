const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const {
  User
} = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();
router.use(jsonParser);
// Post to register a new user
router.post('/', (req, res) => {
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const stringFields = ['username', 'password', 'firstName', 'lastName'];
  const nonStringField = stringFields.find(field =>
    (field in req.body) && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  // If the username and password aren't trimmed we give an error.
  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(field =>
    req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 10,
      // bcrypt truncates after 72 characters
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(field =>
    'min' in sizedFields[field] &&
    req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(field =>
    'max' in sizedFields[field] &&
    req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField ?
        `Must be at least ${sizedFields[tooSmallField].min} characters long` : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let {
    username,
    password,
    firstName = '',
    lastName = ''
  } = req.body;

  firstName = firstName.trim();
  lastName = lastName.trim();

  return User
    .find({
      username
    })
    .count()
    .then(count => {
      if (count > 0) {
        // There is an existing user with the same username
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      // If there is no existing user, hash the password
      return User.hashPassword(password)
    })
    .then(hash => {
      return User
        .create({
          username,
          password: hash,
          firstName,
          lastName
        })
    })
    .then(user => {
      return res.status(201).json(user.apiRepr());
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({
        code: 500,
        message: 'Internal server error'
      });
    });
});


router.post('/login', (req, res) => {

  let username = req.body.username;
  let password = req.body.password;
  let user = null;
  return User
    .findOne({
      username: username
    })
    .then(users => {
      console.log("users", users);
      if (users) {
        user = users;
        return users.validatePassword(password);
      } else {
        return Promise.reject({
          code: 401,
          reason: 'ValidationError',
          message: 'Incorrect Username or Password'
        });
      }
    })
    .then(result => {
      if (result) {
        delete user.password;
        req.session.user = user;
        res.status(201).json({
          message: "Successfully Logged In",
          data: user
        })
      } else {
        res.status(401).json({
          message: 'Incorrect Username or Password'
        });
      }
    })
    .catch(err => {
      console.log("err", err);
      res.status(500).json({
        message: 'Internal server error'
      });
    });
})

router.get('/logout', (req, res) => {
  req.session.authenticated = false
  req.session.destroy();
  return res.redirect('/')
});


module.exports = {
  router
};