/**
* file: api.js
* Entry point for all CMS APIs.
**/

var UserManagement = require('./usermanagement');
var Bongo = require('./data-access/mongodb/dao');
var Publication = require('./publication');
var Models = require('./models');

module.exports = (function() {

  Bongo.connect('mongodb://stimko:stimko@ds031278.mongolab.com:31278/hookandloop');

  return {
    UserManagement: UserManagement,
    Publication: Publication,
    Models: Models;
  };

})();




