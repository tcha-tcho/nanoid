process.env.NODE_ENV = process.env.NODE_ENV || "test"

var url_conn = "https://boveriesepeoverationesma:vnJTbtSRtDcfPivvUuCUmqts@jaobi.cloudant.com:443/dev/"

// var Model = require('../lib/index')
// Model.create_connection(url_conn);
 
// var User = Model.define('User', {
//   name: String
//   ,surname: {type: String, default: "Rambo"}
// })


// User.find("teste", function (err, user) {
//   console.log(user)
//   user.remove(function(x){
//     console.log(x)
//   })
//   // do something with the blog post
// });











  // // var db = require("nano")("https://boveriesepeoverationesma:vnJTbtSRtDcfPivvUuCUmqts@jaobi.cloudant.com:5984/dev/");
  // var db = require("nano")("https://boveriesepeoverationesma:vnJTbtSRtDcfPivvUuCUmqts@jaobi.cloudant.com:443/dev/");
  // // var db = nano.use("dev");

  // // db.merge({"test":(new Date().getTime())},"alice",function(x){
  // //   console.log(x)
  // // });
  // db.get("alice", function (e,b,h) {
  //   console.log(e,b,h);
  //   return;
  // });








var db_connection = require('../lib/connection.js'),
    async = require('async');

if (process.env.NODE_ENV === "te1st") {
  db_connection.create_connection('lazyboy_tests');
} else {
  db_connection.create_connection(url_conn);
}

var db = module.exports.db = db_connection.connection(); 


before(function(done) {
  console.log("cleaning db");

  db.get('_all_docs', function (err, res) {
    if (res && res.rows && res.rows.length) {
      var count = 0;
      function remove_item() {
        if (count < res.rows.length) {
          var item = res.rows[count];
          console.log("removing item (" +item.id+ " / rev: "+item.value.rev+") - " + (count + 1) + " of " + res.rows.length);
          db.destroy(item.id, item.value.rev, function (err, res) {
            if (err) console.log(err)
            count ++;
            remove_item();
          });
        } else {
          console.log("ready")
          done();
        };
      };
      remove_item();
    } else {
      done();
    };

  });
});



