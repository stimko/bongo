/**
* File: query.js
* Query object for mongodb
**/
var utils = require('./utils');
var Connection = require('./connection');
var Populate = require('./populate');

var Query = module.exports = function(opts) {
  this._queryMethod = opts.queryMethod;
  this._params = opts.params;
  this._isCursor = opts.isCursor;

  if(opts.collection){
    this._setCollectionName(opts.collection);
  }

  if (opts.callback) {
    this._setCallback(opts.callback);
  }

  if (this._isValidQuery()) {
    this._setCollection();
  }
};

/////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
/////////////////////////////////////////////////////////////////////////////////

Query.prototype.exec = function(cb) {
  this._setCallback(cb);

  if (this._isCursor){
    this._query.toArray(utils.bind(function(err, array){
      this._callback(err, array);
    }, this));
  }

  if (this._isValidQuery() && !this._query) {
    this._setCollection();
  } 
};

Query.prototype.from = function(name) {
  this._setCollectionName(name);

  if (this._isValidQuery() && !this._query){
    this._setCollection();
  }

  return this;
};

Query.prototype.where = function(field) {
  Object.keys(field).forEach(utils.bind(function(key) {
    this._params[0][key] = field[key];
  }, this));
  return this;
};

Query.prototype.toArray = function(cb) {
  this._query.toArray(cb);
  return this;
};

Query.prototype.each = function(cb) {
  this._query.each(cb);
};

Query.prototype.sort = function(field) {
  this._query.sort(field);
  return this;
};

Query.prototype.skip = function(amount) {
  this._query.skip(amount);
  return this;
};

Query.prototype.limit = function(amount) {
  this._query.limit(amount);
  return this;
};

Query.prototype.populate = function(fields) {
  if (!this._populate) {
    this._populate = new Populate();
  }

  var args = fields.split(' ');
  var argsLength = args.length;
  while(argsLength--){
    this._populate.addField({'field':args[argsLength]});
  }

  return this;
};

/////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
/////////////////////////////////////////////////////////////////////////////////

Query.prototype._setCallback = function(cb) {
  if (this._populate){
    this._callback = this._populate.configurePopulateCallback(cb);
  } else {
    this._callback = cb;
  }
  this._params.push(this._callback);
};

Query.prototype._isValidQuery = function() {
  return ((!!this._isCursor || !!this._callback) && !!Connection.db && !!this._collectionName);
};

Query.prototype._setCollection = function() {
  var dbCollection = Connection.db.collection(this._collectionName);
  this._query = dbCollection[this._queryMethod].apply(dbCollection, this._params);
};

Query.prototype._setCollectionName = function(collection) {
  var model = Array.isArray(collection) ? collection[0] : collection;
  this._collectionName = typeof model === 'string' ? model : this._getCollectionName(model);
};

Query.prototype._getCollectionName = function(model) {
  return model.constructor.name.toLowerCase() + 's';
};
