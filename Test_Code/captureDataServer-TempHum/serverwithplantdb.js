var MS = require("mongoskin");
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var hostname = process.env.HOSTNAME || 'localhost';
var port = 8080;

// MongoDB connections for each sensor
var dbPlant1 = MS.db("mongodb://localhost:27017/sensorData1");
var dbPlant2 = MS.db("mongodb://localhost:27017/sensorData2");

// Initialize values for each sensor
var Plant1Values = { VALUEt: 0, VALUEh: 0, VALUEtime: 0 }; // Change Var names
var Plant2Values = { VALUEt: 0, VALUEh: 0, VALUEtime: 0 };

// Routes for Plant 1
app.get("/getValuePlant1", function (req, res) {
    res.send(Plant1Values.VALUEt.toString() + " " + Plant1Values.VALUEh + " " + Plant1Values.VALUEtime + "\r");
});

app.get("/setValuePlant1", function (req, res) {
    Plant1Values.VALUEt = parseFloat(req.query.t);
    Plant1Values.VALUEh = parseFloat(req.query.h);
    Plant1Values.VALUEtime = new Date().getTime();

    var dataObj = {
        t: Plant1Values.VALUEt,
        h: Plant1Values.VALUEh,
        time: Plant1Values.VALUEtime
    };

    dbPlant1.collection("Plant 1 Information").insert(dataObj, function (err, result) {
        console.log("Added data for Plant 1: " + JSON.stringify(dataObj));
    });

    res.send(Plant1Values.VALUEtime.toString());
});

// Routes for Sensor 2
app.get("/getValuePlant2", function (req, res) {
    res.send(Plant2Values.VALUEt.toString() + " " + Plant2Values.VALUEh + " " + Plant2Values.VALUEtime + "\r");
});

app.get("/setValuePlant2", function (req, res) {
    Plant2Values.VALUEt = parseFloat(req.query.t);
    Plant2Values.VALUEh = parseFloat(req.query.h);
    Plant2Values.VALUEtime = new Date().getTime();

    var dataObj = {
        t: Plant2Values.VALUEt,
        h: Plant2Values.VALUEh,
        time: Plant2Values.VALUEtime
    };

    dbPlant2.collection("Plant 2 Information").insert(dataObj, function (err, result) {
        console.log("Added data for Plant 2: " + JSON.stringify(dataObj));
    });

    res.send(Plant2Values.VALUEtime.toString());
});

// Other routes and configurations (similar to the original code)

app.use(methodOverride());
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));
app.use(errorHandler());

console.log("Server listening at http://" + hostname + ":" + port);
app.listen(port);
