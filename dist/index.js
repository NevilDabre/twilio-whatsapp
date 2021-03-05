"use strict";

// Require express and body-parser
var express = require("express");

var bodyParser = require("body-parser");

require('dotenv').config();

var {
  router
} = require('./routes'); // Initialize express and define a port


var app = express(); // Tell express to use body-parser's JSON parsing

app.use(bodyParser.urlencoded({
  extended: false
})); // Start express on the defined port

app.listen(process.env.PORT, () => console.log("\uD83D\uDE80 Server running on port ".concat(process.env.PORT))); // app.post("/receive", (req, res) => {
//   console.log(req.body) // Call your action on the request here
//   res.status(200).end() // Responding is important
// })

app.use('/', router);