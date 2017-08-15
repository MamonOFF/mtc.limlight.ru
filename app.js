var express = require("express");
var bodyParser = require("body-parser");
var mongoClient = require('mongodb').MongoClient;

var app = express();
var jsonParser = bodyParser.json();
var zapros = 0;

app.use(express.static(__dirname+"/public"));

app.post("/detallization", jsonParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    console.log(++zapros);
  //  console.log(request.body.number[0]);
    if(request.body.number[0] == 8){request.body.number='7'+request.body.number.substring(1);}
    mongoClient.connect("mongodb://localhost:27017/mtc", function(err, db){
        if(err) return console.log(err);
        db.collection("mtc").findOne({phoneNumber:request.body.number,month:request.body.month},function(err, doc){
            //console.log(doc);
            db.close();
            response.json(doc);
        });
    });

});

app.listen(80, function () {
  console.log("Start server");
});
