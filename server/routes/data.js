var express = require('express');
var router = express.Router();
var pg = require('pg');

console.log("In data.js");
var connectionString = 'postgres://localhost:5432/mightyplaydb';

//if(process.env.DATABASE_URL != undefined) {
//    connectionString = process.env.DATABASE_URL + "?ssl=true";
//} else {
//    connectionString = 'postgres://localhost:5432/inorder_game_db';
//}


//console.log('in data, here is connectionstring: ' + connectionString);


router.get('/', function(req, res){

    var gameArray = [];

    pg.connect(connectionString, function(err, client, done){
        //console.log("Top error: ", err);
        var query = client.query("SELECT id, category, focus, question, " +
            "ans1, ans2, ans3, ans4, sol1 FROM letsplay ORDER BY id ASC;");

        query.on('row', function(row){
            gameArray.push(row);
        });

        query.on('end', function(){
            client.end();
            //console.log("From server app.js: ", triviaArray);
            return res.json(gameArray);
        });

        if(err) console.log("Error: ", err);

    });

});

module.exports = router;