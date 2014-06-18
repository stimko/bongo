'use strict';

var assert = require('assert');
var DAO = require('../../mongodb/dao');
var User = require('../../../users/models/user');
var Role = require('../../../users/models/role');
var Group = require('../../../users/models/group');

describe('MongoDB Data Access Object', function() {

  before(function(done) {
    DAO.connect("mongodb://stimko:stimko@ds041327.mongolab.com:41327/hook_and_loop_testing", function(err, result) {
      if (err) {
        done(err);
      }
      DAO.remove('users').exec(done);
    });
  });

  describe('DB Methods', function() {

    describe('#create()', function() {

      after(function(done){
        DAO.remove('users').exec(done);
      });

      it('should create a new user', function(done) {
        var user = new User({firstName:'testing'});
        DAO.create(user).exec(done);
      });

      it('should retrieve a new user', function(done) {
        DAO.findOne({firstName:'testing'}, 'users', done);
      });
    });


    describe('#removeOne()', function() {
      var user = new User({firstName:'testing'});

      after(function(done){
        DAO.remove('users').exec(done);
      });

      it('should create a new user', function(done) {
        DAO.create(user).exec(done);
      });

      it('should remove the user', function(done) {
        DAO.removeOne({'_id': user._id}, 'users').exec(done);
      });

      it('should find the users collection and verify it is empty', function(done) {
        DAO.find('users').exec(function(err, result) {
          assert.equal(result.length, 0);
          done();
        });
      });
    });

    describe('#updateOne()', function() {

      after(function(done){
        DAO.remove('users').exec(done);
      });

      it('should create a new users', function(done) {
        DAO.create([new User({role:'admin'}), new User({role:'customer'})]).exec(done);
      });

      it('should find and update a user', function(done) {
        DAO.updateOne({role:'admin'}, {name:'testing'}, 'users').exec(done);
      });

      it('should find the updated user', function(done) {
        DAO.find({name:'testing'}, 'users').exec(function(err, result){
          assert.equal(result.length, 1);
          done();
        });
      });
    });

    describe('#findOne()', function() {

      after(function(done){
        DAO.remove('users').exec(done);
      });

      it('should create a new user', function(done) {
        var user = new User({firstName:'testing'});
        DAO.create(user).exec(done);
      });

      it('should retrieve a user based on firstName', function(done) {
        DAO.findOne({firstName:'testing'}, 'users').exec(function(err, result){
          assert.equal(result.firstName, 'testing');
          done();
        });
      });
    });

    describe('#updateMulti()', function() {

      after(function(done){
        DAO.remove('users').exec(done);
      });

      it('should create new users', function(done) {
        DAO.create([new User({role:'admin'}), new User({role:'admin'})]).exec(done);
      });

      it('should update new users', function(done) {
        DAO.updateMulti({role:'admin'}, {name:'testing'}).from('users').exec(function(err, result){
          done();
        });
      });

      it('should find the updated users', function(done) {
        DAO.find({name:'testing'}, 'users').exec(function(err, result){
          assert.equal(result.length, 2);
          done();
        });
      });
    });

    describe('#remove()', function() {

      it('should create new users', function(done) {
        DAO.create([new User({firstName:'testing'}), new User({firstName:'testing2'})]).exec(done);
      });

      it('should remove all users', function(done) {
        DAO.remove("users").exec(done);
      });
    });

    describe('#find()', function() {

      after(function(done){
        DAO.remove('users').exec(done);
      });

      it('should create new users', function(done) {
        DAO.create([new User({firstName:'testing'}), new User({firstName:'testing2'})]).exec(done);
      });

      it('should retrieve all user documents', function(done) {
        DAO.find('users').exec(function(err, result) {
          assert(result.length, 2);
          done();
        });
      });
    });

    describe('#findAndModify()', function() {

      after(function(done){
        DAO.remove('users').exec(done);
      });

      it('should create new users', function(done) {
        DAO.create([new User({firstName:'testing'}), new User({firstName:'testing2'})]).exec(done);
      });

      it('should find and modify all user documents', function(done) {
        DAO.findAndModify({data:{firstName:'newName'}}).from('users').where({firstName:'testing'}).exec(function(err, result) {
          assert(result.firstName, 'newName');
          done();
        });
      });
    });

    describe('#drop()', function() {

      it('should create new users', function(done) {
        DAO.create([new User({firstName:'testing'}), new User({firstName:'testing2'})]).exec(done);
      });

      it('should drop the collection', function(done) {
        DAO.drop('users', done);
      });
    });
  });

  describe('Chainable Methods', function() {

    describe('#sort()', function() {

      after(function(done){
        DAO.remove('users').exec(done);
      });

      it('should create new users', function(done) {
        DAO.create(
          [new User({firstName:'testing', age:46}),
          new User({firstName:'testing2', age:34}),
          new User({firstName:'testing3', age:25})]
        ).exec(done);
      });

      it('should find users and sort them by age', function(done) {
        DAO.find('users').sort({age:1}).exec(function(err, result) {
          assert.equal(result[0].age, 25);
          assert.equal(result[1].age, 34);
          done();
        });
      });
    });

    describe('#from()', function() {

      after(function(done){
        DAO.remove('users').exec(done);
      });

      it('should create new users', function(done) {
        DAO.create(
          [new User({firstName:'testing', age:46}),
          new User({firstName:'testing2', age:34}),
          new User({firstName:'testing3', age:25})]
        ).exec(done);
      });

      it('should find users and sort them by age', function(done) {
        DAO.find().from('users').sort({age:1}).exec(function(err, result) {
          assert.equal(result[0].age, 25);
          assert.equal(result[1].age, 34);
          done();
        });
      });
    });

    describe('#where()', function() {

      after(function(done) {
        DAO.remove('users').exec(done);
      });

      it('should create new users', function(done) {
        DAO.create(
          [new User({firstName:'testing', age:11}),
          new User({firstName:'testing1', age:14}),
          new User({firstName:'testing2', age:7}),
          new User({firstName:'testing3', age:25}),
          new User({firstName:'testing4', age:34})]
        ).exec(done);
      });

      it('it should find users under the age of 25', function(done) {
        DAO.find().from('users').where({age:{$lt:25}}).sort({age:1}).exec(function(err, result) {
          assert.equal(result.length, 3);
          assert.equal(result[0].age, 7);
          done();
        });
      });
    });

    describe('#populateObject()', function() {

      var role = {"name":"role1","users":null,"permissions":null,"_id":1};

      after(function(done) {
        DAO.remove('roles').exec(done);
      });

      after(function(done) {
        DAO.remove('users').exec(done);
      });

      after(function(done) {
        DAO.remove('groups').exec(done);
      });

      it('should create new users', function(done) {
        DAO.create(
          [new User({firstName:'testing', age:11, role:1, groups:[1,2]}),
          new User({firstName:'testing1', age:14, role:2, groups:[2,3]}),
          new User({firstName:'testing2', age:7, role:3, groups:[3,4]}),
          new User({firstName:'testing3', age:25, role:4, groups:[4,5]}),
          new User({firstName:'testing4', age:34, role:5, groups:[1,3]})]
        ).exec(done);
      });

      it('should create new roles', function(done){
        DAO.create(
          [new Role({name:'role1', _id:1}),
          new Role({name:'role2', _id:2}),
          new Role({name:'role3', _id:3}),
          new Role({name:'role4', _id:4}),
          new Role({name:'role5', _id:5})]
        ).exec(done);
      });

      it('should create new groups', function(done){
        DAO.create(
          [new Group({name:'group1', _id:1}),
          new Group({name:'group2', _id:2}),
          new Group({name:'group3', _id:3}),
          new Group({name:'group4', _id:4}),
          new Group({name:'group5', _id:5})]
        ).exec(done);
      });

      it('should find a user and populate role and groups', function(done) {
        DAO.findOne({firstName:'testing'}).from('users').populate('role groups').exec(function(err, result){
          assert.deepEqual(result.role, role);
          done();
        });
      });
    });

    describe('#populateArray()', function() {

      after(function(done) {
        DAO.remove('roles').exec(done);
      });

      after(function(done) {
        DAO.remove('users').exec(done);
      });

      after(function(done) {
        DAO.remove('groups').exec(done);
      });

      it('should create new users', function(done) {
        DAO.create(
          [new User({firstName:'testing', age:11, role:1, groups:[1,2]}),
          new User({firstName:'testing1', age:14, role:2, groups:[2,3]}),
          new User({firstName:'testing2', age:7, role:3, groups:[3,4]}),
          new User({firstName:'testing3', age:25, role:4, groups:[4,5]}),
          new User({firstName:'testing4', age:34, role:5, groups:[1,3]})]
        ).exec(done);
      });

      it('should create new roles', function(done){
        DAO.create(
          [new Role({name:'role1', _id:1}),
          new Role({name:'role2', _id:2}),
          new Role({name:'role3', _id:3}),
          new Role({name:'role4', _id:4}),
          new Role({name:'role5', _id:5})]
        ).exec(done);
      });

      it('should create new groups', function(done){
        DAO.create(
          [new Group({name:'group1', _id:1}),
          new Group({name:'group2', _id:2}),
          new Group({name:'group3', _id:3}),
          new Group({name:'group4', _id:4}),
          new Group({name:'group5', _id:5})]
        ).exec(done);
      });

      it('should find a user and populate role', function(done) {
        DAO.find().from('users').populate('groups role').sort({age:-1}).exec(function(err, result){
          console.log(result[2]);
          console.log(result[2].groups[0], result[2].groups[1]);
          done();
        });
      });
    });
  });
});