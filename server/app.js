'use strict';
var express = require('express');

// IBM Bluemix Cloud Foundry utility
var cfenv = require('cfenv');

// News gathering module
var fetch = require('./fetch-news');

// Basic Express app; not necessary
var app = express();
app.use(express.static(__dirname + '/public'));
var appEnv = cfenv.getAppEnv();
app.listen(appEnv.port, function() {
  console.log('server starting on ' + appEnv.url);
});

// Fetch data once upon server start
fetch();

// Fetch new data every 4 hours thereafter
setInterval(fetch, 14400000);
