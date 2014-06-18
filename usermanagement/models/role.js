/**
* file: role.js
* Role Model
**/

module.exports = function Role(opts) {
  this.name = opts.name;
  this.users = opts.users;
  this.permissions = opts.permissions;
  if (opts._id){
    this._id = opts._id;
  }
};