'use strict';
var request = require('request');
var AlchemyAPI = require('./alchemyapi');
var Firebase = require('firebase');
var keys = require('./keys');

var alchemyapi = new AlchemyAPI();
var firebase = new Firebase(keys.firebase);
// var firebase = new Firebase(keys.firebaseDev);

module.exports = function() {
  firebase.remove();

  var nytAPI = 'http://api.nytimes.com/svc/mostpopular/v2/mostviewed/';
  var daysKey = '/1?';
  var sections = {
    'Top News': 'all-sections',
    US: 'national',
    World: 'world',
    Opinion: 'opinion',
    Tech: 'technology',
    Science: 'science',
  };

  var gatherNews = function(section, title) {
    request(nytAPI + section + daysKey + keys.nytimes, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var info = JSON.parse(body);
        for (var i = 0; i < 5; i++) {
          (function(num) {
            alchemyapi.keywords('url', info.results[num].url, {sentiment: 1}, function(response) {
              response.title = info.results[num].title;
              firebase.child(title).child(num).set(response);
            });
          })(i);
        }
      }
    });
  };

  for (var key in sections) {
    gatherNews(sections[key], key);
  }

};
