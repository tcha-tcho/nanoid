process.env.NODE_ENV = process.env.NODE_ENV || "test"

////////////////////////////////////////////////////////////
var url_conn = "https://turtseephybraormamearkso:aAYnHO7TAcEdiCKLObnw5sXW@timets.cloudant.com:443/testing/"
////////////////////////////////////////////////////////////




if (url_conn == "supply here") {
  console.log("\n\n")
  console.log("---------------------------------------------------------------------------------------")
  console.log("'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''\n")
  console.log("PLEASE, on /specs/spec_helper.js supply your database connection string on 'url_conn'")
  console.log("something like this:")
  console.log("https://boveriesepeoverationesma:vnJTbtSRtDcfPiVvUXCUXqts@example.cloudant.com:443/dev/")
  console.log("\n.......................................................................................")
  console.log("---------------------------------------------------------------------------------------")
  console.log("\n\n")
  return false;
};

var db_connection = require('../lib/connection.js'),
    async = require('async');

if (process.env.NODE_ENV === "te1st") {
  db_connection.create_connection('nanoid_tests');
} else {
  db_connection.create_connection(url_conn);
}

var db = module.exports.db = db_connection.connection(); 




before(function(done) {
  console.log("cleaning db");
  var checker = 0;
  function remove_all(){

    db.get('_all_docs', function (err, res) {
      if (res && res.rows && res.rows.length) {
        var count = 0;
        var removed = 0;
        var length = res.rows.length;
        function remove_item() {
          if (count < res.rows.length) {
            var item = res.rows[count];
            console.log("removing item (" +item.id+ " / rev: "+item.value.rev+") - " + (count + 1) + " of " + res.rows.length);
            db.destroy(item.id, item.value.rev, function (err, res) {
              if (err) console.log(err)
              removed ++;
              if (removed == length) {
                if (checker < 3) {
                  checker ++;
                  console.log("checking again... " + checker)
                  remove_all();
                } else {
                  console.log("removed!")
                  done();
                };
              }
            });
            count ++;
            remove_item();
          } else {
            console.log("waiting removes...")
          };
        };
        remove_item();
      } else {
        if (checker < 3) {
          checker ++;
          console.log("checking again... " + checker)
          remove_all();
        } else {
          console.log("ready! ok")
          done();
        };
      };

    });

  };
  remove_all();
});



