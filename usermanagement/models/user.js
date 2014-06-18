/**
* file: user.js
* User Model
**/

module.exports = function User(opts) {
  this.firstName = opts.firstName;
  this.lastName = opts.lastName;
  this.age = opts.age;
  this.fullName = opts.fullName;
  this.email = opts.email;
  this.encryptedPassword = opts.encryptedPassword;
  this.role = opts.role;
  this.groups = opts.groups;
};