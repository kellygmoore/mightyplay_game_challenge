var express = require("express");
var app = express();
var path = require('path');
var pg = require('pg');

app.set("port", process.env.PORT || 5000);

console.log("In server app.js");

var data = require('./routes/data');
var index = require('./routes/index');

//app.get("/*", function(req,res,next){
//    var file = req.params[0] || "assets/views/index.html";
//    res.sendFile(path.join(__dirname, "./public/", file))
//});


app.use('/data', data);
app.use('/', index);

app.listen(app.get("port"), function(req,res,next){
    console.log("Listening on port: " + app.get("port"));
});

module.exports = app;