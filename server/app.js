'use strict';
var express = require('express');
var cfenv = require('cfenv');
var fetch = require('./fetch-news');

var app = express();
app.use(express.static(__dirname + '/public'));
var appEnv = cfenv.getAppEnv();
app.listen(appEnv.port, function() {
  console.log('server starting on ' + appEnv.url);
});

// console.log(count);
var count = 0;

var inc = function() {
  count++;
  console.log(count);
};

setInterval(inc, 10000);
setInterval(fetch, 10000);
// setInterval(inc, 14400000);
// setInterval(fetch, 14400000);

// console.log(count);