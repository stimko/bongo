var Connection = require('./connection');
var utils = require('./utils');

var Populate = module.exports = function() {
  this._populateObjects = [];
  this._populatedResultArray = [];
  this._completedPopulateCallbacks = 0;
};

/////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
/////////////////////////////////////////////////////////////////////////////////

Populate.prototype.addField = function(field) {
  this._populateObjects.push(field);
};


Populate.prototype.configurePopulateCallback = function(cb) {
  this._cb = cb;
  return utils.bind(function(err, result) {
    var populateLength = this._populateObjects.length;
    this._result = result;
    if (typeof result === 'object' && !Array.isArray(result)) {
      this._totalLength = populateLength;
      for (var i = 0; i < populateLength; i++){
        this._executePopulate(result, this._populateObjects[i].field);
      }
    } else if (Array.isArray(result)) {
      var arrayLength = result.length;
      this._totalLength = populateLength * arrayLength;
      for (var u = 0; u < arrayLength; u++){
        for (var a = 0; a < populateLength; a++) {
          this._executePopulate(result[u], this._populateObjects[a].field);
        }
      }
    }
  }, this);
};

/////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
/////////////////////////////////////////////////////////////////////////////////

Populate.prototype._executePopulate = function(record, field) {
  if (Array.isArray(record[field])) {
    this._executeArrayAttributePopulate(record, field);
  } else {
    this._executeSingleAttributePopulate(record, field);
  }
};

Populate.prototype._executeArrayAttributePopulate = function(record, field) {
  var attr = record[field];
  var arrayLength = attr.length;
  var populatedResultArray = [];
  var arrayCallbacks = 0;
  this._totalLength += (arrayLength - 1);
  for (var i = 0; i < arrayLength; i++) {
    Connection.db.collection(field).findOne({'_id':attr[i]}, utils.bind(function(err, populateResult) {
      populatedResultArray.push(populateResult);
      this._completedPopulateCallbacks++;
      arrayCallbacks++;
      if(arrayLength === arrayCallbacks){
        record[field] = populatedResultArray;
      }
      if (this._completedPopulateCallbacks === this._totalLength) {
        this._cb(err, this._result);
      }
    }, this));
  }
};

Populate.prototype._executeSingleAttributePopulate = function(record, field){
  Connection.db.collection(field + 's').findOne({'_id':record[field]}, utils.bind(function(err, populateResult) {
    record[field] = populateResult;
    this._completedPopulateCallbacks++;
    if (this._completedPopulateCallbacks === this._totalLength) {
      this._cb(err, this._result);
    }
  }, this));
};

