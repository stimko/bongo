/**
* file: api.js
* User Data Access Methods.
**/

var Bongo = require('../data-access/mongodb/dao');

module.exports = {
  getUsers: function(cb) {
    Bongo.find().from('users').exec(function (err, result){
      cb(err, result);
    });
  },

  findUsers: function(query, cb) {
    Bongo.find().where(query).from('users').exec(function(err, result) {
      cb(err, result);
    });
  }
};
