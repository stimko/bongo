var MongoClient = require('mongodb').MongoClient;
var utils = require('./utils');

module.exports = {

  open: function(url, cb) {
    MongoClient.connect(url, utils.bind(function(err, db){
      this.db = db;
      cb(err, db);
    }, this));
  },

  close: function(cb) {
    if (this.connected){
      return MongoClient.close(cb);
    }
    cb();
  }
};