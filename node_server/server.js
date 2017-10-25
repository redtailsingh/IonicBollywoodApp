var express = require('express');
var app = express();
var fs = require("fs");

app.get('/list_movies', function (req, res) {
   fs.readFile( __dirname + "/" + "movies.json", 'utf8', function (err, data) {
       res.end( data );
   });
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
