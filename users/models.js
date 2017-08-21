const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    firstName: {
      type: String,
      default: "Anonymous"
    },
    lastName: {
      type: String,
      default: "Comic-lover"
    },
  },
  catalog: {
    title: {
      type: String,
      required: true
    },
    issue: {
      type: Number,
      required: true
    },
    Publisher: {
      type: String,
      required: true
    },
    Published: {
      type: Date
    }
  }
});

UserSchema.methods.apiRepr = function () {
  return {
    username: this.username || '',
    firstName: this.name.firstName || '',
    lastName: this.name.lastName || '',
    items: this.catalog.length || ''
  };
}

UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
}

UserSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
}

const User = mongoose.model('User', UserSchema);

module.exports = {
  User
};