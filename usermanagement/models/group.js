/**
* file: role.js
* Group Model
**/

module.exports = function Group(opts) {
  this.name = opts.name;
  if (opts._id){
    this._id = opts._id;
  }
}