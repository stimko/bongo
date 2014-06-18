/**
* File: dao.js
* Abstracts all MongoDb data access.
**/

/////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
/////////////////////////////////////////////////////////////////////////////////

var Query = require('./query');
var utils = require('./utils');
var Connection = require('./connection');

module.exports = exports = {
  queuedQueries: [],
  connect: function(url, cb) {
    Connection.open(url, utils.bind(function(err, db) {
      if (cb) {
        cb(err, db);
      }

      if (db) {
        if (this.queuedQueries.length) {
          this.queuedQueries.forEach(utils.bind(function(query) {
            query.exec();
          }, this));
        }
      } else {
        console.log(err);
      }
    }, this));
  },

  close: function(cb) {
    this.connection.close(cb);
  },

  create: function(model, collection, callback) {
    if (typeof collection === 'function') {
      callback = collection;
      collection = null;
    }

    if (!collection) {
      collection = model;
    }

    return this.enqueueQuery(new Query({
      callback:callback,
      collection:collection,
      queryMethod: 'insert',
      params:[model]
    }));
  },

  findOne: function(query, collection, callback) {
    if (typeof collection === 'function'){
      callback = collection;
      collection = null;
    }

    return this.enqueueQuery(new Query({
      callback:callback,
      collection:collection,
      queryMethod: 'findOne',
      params:[query]
    }));
  },

  find: function(query, collection, callback) {
    query = query || {};

    if (typeof collection === 'function'){
      callback = collection;
      collection = null;
    }

    if (typeof query === 'string') {
      collection = query;
      query = {};
    }

    return this.enqueueQuery(new Query({
      callback:callback,
      collection:collection,
      queryMethod: 'find',
      isCursor: true,
      params:[query]
    }));
  },


  remove: function(query, collection, callback) {
    if (typeof collection === 'function'){
      callback = collection;
      collection = null;
    }

    if (typeof query === 'string') {
      collection = query;
      query = {};
    }

    return this.enqueueQuery(new Query({
      callback:callback,
      collection:collection,
      queryMethod: 'remove',
      params:[query]
    }));
  },

  updateMulti: function(query, data, collection, callback) {
    return this.enqueueQuery(new Query({
      callback:callback,
      collection:collection,
      queryMethod: 'update',
      params:[query, {$set:data}, {multi:true}]
    }));
  },

  updateOne: function(query, data, collection, callback) {
    if (typeof collection === 'function'){
      callback = collection;
      collection = null;
    }

    return this.enqueueQuery(new Query({
      callback:callback,
      collection:collection,
      queryMethod: 'update',
      params: [query, {$set:data}]
    }));
  },

  findAndModify: function(opts) {
    var query = opts.query || {};
    var sort = opts.sort || [];
    var data = opts.data;
    var collection = opts.collection;
    var callback = opts.callback;

    return this.enqueueQuery(new Query({
      callback:callback,
      collection:collection,
      queryMethod: 'findAndModify',
      params: [query, sort, {$set:data}]
    }));
  },

  removeOne: function(query, collection, callback) {
    return this.enqueueQuery(new Query({
      callback:callback,
      collection:collection,
      queryMethod: 'findAndRemove',
      params: [query]
    }));
  },

  drop: function(collection, callback){
    return this.enqueueQuery(new Query({
      callback:callback,
      collection:collection,
      queryMethod: 'drop',
      params: []
    }));
  },

  enqueueQuery: function(query) {
    if (!!Connection.db) {
      return query;
    } else {
      this.queuedQueries.push(query);
      return query;
    }
  }
};
