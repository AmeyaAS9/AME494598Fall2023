// Importing necessary modules
const express = require("express");
const app = express();
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
const bodyParser = require('body-parser');
const MS = require("mongoskin");

// Setting up the hostname and port
const hostname = process.env.HOSTNAME || 'localhost';
const port = 1234; // You can change this to any port you prefer

// Connecting to MongoDB using mongoskin
const db = MS.db("mongodb://13.56.213.25:27017/pingData");

// Middleware for parsing request bodies
app.use(bodyParser.json());

// Handling root route
app.get("/", function (req, res) {
    res.send("Server is running");
});

// Handling a route for receiving a ping message
app.post("/ping", function (req, res) {
    // Extracting data from the request body
    const pingMessage = req.body.message;

    // Adding timestamp to the request object
    req.body.time = new Date().getTime();

    // Inserting the ping message data into the "ping_messages" collection in MongoDB
    db.collection("ping_messages").insert(req.body, function(err, result){
        if (err) {
            console.error("Error inserting ping message into the database:", err);
            res.status(500).send("Internal Server Error");
        } else {
            // Check if any documents were inserted
            if (result && result.result && result.result.ok === 1 && result.result.n === 1) {
                // Sending a response indicating success
                res.send("Ping message received and stored!");
            } else {
                console.error("Error: No documents inserted");
                res.status(500).send("Internal Server Error");
                
            }
        }
    });
});


// Starting the server and logging the information
app.listen(port, () => {
    console.log(`Server is listening at http://${hostname}:${port}`);
});
