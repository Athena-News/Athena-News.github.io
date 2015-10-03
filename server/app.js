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

fetch();
setInterval(fetch, 14400000);
