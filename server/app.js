var Firebase = require('firebase');
var AlchemyAPI = require('./alchemyapi');
var keys = require('./keys');
var request = require('request');
// var express = require('express');
// var cfenv = require('cfenv');

// var app = express();
// app.use(express.static(__dirname + '/public'));
// var appEnv = cfenv.getAppEnv();
// app.listen(appEnv.port, function() {
//   console.log("server starting on " + appEnv.url);
// });

var alchemyapi = new AlchemyAPI();
var firebase = new Firebase(keys.firebase);

firebase.remove();

request('http://api.nytimes.com/svc/mostpopular/v2/mostviewed/all-sections/1?' + keys.nytimes, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    for (var i = 0; i < 5; i++) {
      (function(num) {
        alchemyapi.keywords('url', info.results[num].url, {sentiment: 1}, function(response) {
          response.title = info.results[num].title;
          firebase.child('Top News').child(num).set(response);
        });
      })(i);
    }
  }
});

request('http://api.nytimes.com/svc/mostpopular/v2/mostviewed/national/1?' + keys.nytimes, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    for (var i = 0; i < 5; i++) {
      (function(num) {
        alchemyapi.keywords('url', info.results[num].url, {sentiment: 1}, function(response) {
          response.title = info.results[num].title;
          firebase.child('US').child(num).set(response);
        });
      })(i);
    }
  }
});

request('http://api.nytimes.com/svc/mostpopular/v2/mostviewed/world/1?' + keys.nytimes, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    for (var i = 0; i < 5; i++) {
      (function(num) {
        alchemyapi.keywords('url', info.results[num].url, {sentiment: 1}, function(response) {
          response.title = info.results[num].title;
          firebase.child('World').child(num).set(response);
        });
      })(i);
    }
  }
});

request('http://api.nytimes.com/svc/mostpopular/v2/mostviewed/opinion/1?' + keys.nytimes, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    for (var i = 0; i < 5; i++) {
      (function(num) {
        alchemyapi.keywords('url', info.results[num].url, {sentiment: 1}, function(response) {
          response.title = info.results[num].title;
          firebase.child('Opinion').child(num).set(response);
        });
      })(i);
    }
  }
});

request('http://api.nytimes.com/svc/mostpopular/v2/mostviewed/technology/1?' + keys.nytimes, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    for (var i = 0; i < 5; i++) {
      (function(num) {
        alchemyapi.keywords('url', info.results[num].url, {sentiment: 1}, function(response) {
          response.title = info.results[num].title;
          firebase.child('Tech').child(num).set(response);
        });
      })(i);
    }
  }
});

request('http://api.nytimes.com/svc/mostpopular/v2/mostviewed/science/1?' + keys.nytimes, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    for (var i = 0; i < 5; i++) {
      (function(num) {
        alchemyapi.keywords('url', info.results[num].url, {sentiment: 1}, function(response) {
          response.title = info.results[num].title;
          firebase.child('Science').child(num).set(response);
        });
      })(i);
    }
  }
});
