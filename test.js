var url_conn = "https://boveriesepeoverationesma:vnJTbtSRtDcfPivvUuCUmqts@jaobi.cloudant.com:443/dev/"
// var db = require("nano")(url_conn);

// db.insert({"test":(new Date().getTime())},"alice",function(x){
//   console.log(x)
// });



var Model = require('./lib/index')
Model.create_connection(url_conn);



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