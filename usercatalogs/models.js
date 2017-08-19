const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserCatalogSchema = mongoose.Schema({
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
  },
});

UserCatalogSchema.methods.apiRepr = function () {
  return {
    seriesTitle: this.title || '',
    issueNumber: this.issue || '',
    publisher: this.publisher || '',
    published: this.published || ''
  };
}

const UserCatalog = mongoose.model('UserCatalog', UserCatalogSchema);

module.exports = {
  UserCatalog
};