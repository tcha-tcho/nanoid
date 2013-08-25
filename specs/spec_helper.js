process.env.NODE_ENV = process.env.NODE_ENV || "test"

var db_connection = require('../lib/connection.js'),
    // cradle = require('cradle'),
    async = require('async');

if (process.env.NODE_ENV === "te1st") {
  db_connection.create_connection('lazyboy_tests');
} else {
  // db_connection.create_connection({url: 'https://garrensmith.cloudant.com', port: '443', cache: true, secure:true, db:'lazyboy_tests'});

 db_connection.create_connection({
    auth: { // not required
      username: 'boveriesepeoverationesma',
      password: 'vnJTbtSRtDcfPivvUuCUmqts'
    }
    ,url:'https://jaobi.cloudant.com'
    ,db: 'dev'
    ,port: '443'
    ,cache: true
    ,secure:true
  });

}

var db = module.exports.db = db_connection.connection(); 





// var Model = require('../lib/index')
var url_conn = "https://boveriesepeoverationesma:vnJTbtSRtDcfPivvUuCUmqts@jaobi.cloudant.com:443/dev/"
// Model.create_connection(url_conn);



var User = Model.define('User', {
  name: String
  ,surname: {type: String, default: "Rambo"}
})

// var user = User.create({_id:"teste", name: "John", surname: "Rambo"});

// user.save(function (err, saved_user) {
//   console.log(err)
//   // console.log(saved_user)
// })


User.find("teste", function (err, user) {
  console.log(user)
  user.remove(function(x){
    console.log(x)
  })
  // do something with the blog post
});



before(function(done) {

  console.log("cleaning db");

  db.get('_all_docs', function (err, res) {

    async.forEach(JSON.parse(res), function (item, cb) {
      db.remove(item.id, item.value.rev, function (err, res) {cb();});
    }, function () {
      done();
    });

  });
});



