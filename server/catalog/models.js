const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserCatalogSchema = mongoose.Schema({
  userid: {
    type: String,
    require: true
  },
  title: {
    type: String,
    required: true
  },
  issue: {
    type: Number,
    required: true
  },
  publisher: {
    type: String,
    required: true
  },
  imgUrl: {
    type: String
  },
  description: {
    type: String
  },
  pageUrl: {
    type: String
  }
});


const UserCatalog = mongoose.model('usercatalogs', UserCatalogSchema, "usercatalogs");

module.exports = {
  UserCatalog
};