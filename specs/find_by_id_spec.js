// var cradle = require('cradle'),
var assert = require('assert'),
    Model = require('../lib/index'),
    db = require('./spec_helper').db,
    User;

describe("Find document by Id", function () { 

  before(function (done) {
    Model.define('User', {name: String });
    Model.load(function () {
      User = Model('User');
      done();
    });
  })

  it("Should find saved document by id", function (done) {
    var user_doc = {
      id : "test-user-id",
    name: "garren"
    };

    db.save(user_doc.id, user_doc, function (err, req) {

      User.find(user_doc.id, function (err, user) {
        user.id.should.equal(user_doc.id);
        user.name.should.equal("garren");
        done();
      });
    });
  });

  it("Should return null for no user with Id", function (done) {
    User.find("unknown", function (err, user) {
      err.error.should.equal("not_found");
      assert.equal(user, null);
      done();
    });      
  })

  it("Should contain update and created date", function (done) {
    User.create({name:"John Rambo"}).save(function (err, user) {
      User.find(user.id, function (err, find_user) {

        var current_date = new Date();
        find_user.dateCreated.getHours().should.equal(current_date.getHours());
        find_user.lastUpdated.getHours().should.equal(current_date.getHours());
        done();

      });

    });
  });
});





