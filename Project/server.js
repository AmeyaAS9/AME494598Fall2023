var MS = require("mongoskin");
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var hostname = process.env.HOSTNAME || 'localhost';
var port = 8080;

var val_temp = 0;
var val_level1 = 0;
var val_level2 = 0;
var stat_pump1 = false;
var stat_pump2 = false;
var stat_heat = false;
var val_timestamp = 0;


var db = MS.db("mongodb://localhost:27017/plantData")
app.get("/", function (req, res) {
    res.redirect("/index.html");
});

app.get("/getAverage", function (req, res) {
  var from = parseInt(req.query.from);
  var to = parseInt(req.query.to);
  db.collection("dataPlant").find({time:{$gt:from, $lt:to}}).toArray(function(err, result){
  	console.log(err);
  	console.log(result);
  	var tempSum = 0;
  	var level1Sum = 0;
    var level2Sum = 0;
  	for(var i=0; i< result.length; i++){
  		tempSum += result[i].t || 0;
  		level1Sum += result[i].t || 0;
      level2Sum += result[i].t || 0;
  	}
  	var tempAvg = tempSum/result.length;
  	var level1Avg = level1Sum/result.length;
    var level2Avg = level2Sum/result.length;
  	res.send(tempAvg + " "+  level1Avg  + " "+level2Avg);
  });
});

app.get("/getLatest", function (req, res) {
  db.collection("dataPlant").find({}).sort({time:-1}).limit(10).toArray(function(err, result){
    res.send(JSON.stringify(result));
  });
});

app.get("/getData", function (req, res) {
  var from = parseInt(req.query.from);
  var to = parseInt(req.query.to);
  db.collection("dataPlant").find({time:{$gt:from, $lt:to}}).sort({time:-1}).toArray(function(err, result){
    res.send(JSON.stringify(result));
  });
});


app.get("/getValue", function (req, res) {
  //res.writeHead(200, {'Content-Type': 'text/plain'});
  res.send(val_temp + " " + val_level1 + " " + val_level2 + " " + stat_heat + " "  + stat_pump1 + " " + stat_pump2 + " " + val_timestamp + "\r");
});

app.get("/setValue", function (req, res) {
  val_temp = parseFloat(req.query.fluid_temperature);
  val_level1 = parseFloat(req.query.level_tank1);
  val_level2 = parseFloat(req.query.level_tank2);
  stat_heat = parseBool(re.query.pump1_status);
  stat_pump1 = parseBool(re.query.pump2_status);
  stat_pump2 = parseBool(re.query.heater_status);
  val_timestamp = new Date().getTime();
	var dataObj = {
		fluid_temperature: val_temp,
		level_tank1: val_level1,
    level_tank2: val_level2,
    heater_status: stat_heat,
    pump1_status: stat_pump1,
    stat_pump2: stat_pump2,
		time: val_timestamp,
	}
	db.collection("dataPlant").insert(dataObj, function(err,result){
		console.log("added data: " + JSON.stringify(dataObj));
	});
  res.send(val_timestamp.toString());
});


app.use(methodOverride());
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));
app.use(errorHandler());

console.log("Simple static server listening at http://" + hostname + ":" + port);
app.listen(port);
