'use strict';
var request = require('request');
var AlchemyAPI = require('./alchemyapi');
var Firebase = require('firebase');

// Keep secret keys in separate module. should have the following form:
// module.exports = {
//   firebase: 'https://sample-firebase-url.firebaseio.com/',
//   firebaseDev: 'https:another-firebase-url.firebaseio.com',
//   nytimes: 'api-key=*******'
// };
var keys = require('./keys');

// Instantiate Alchemy and Firebase instances
var alchemyapi = new AlchemyAPI();

// Pass in Firebase app URL from keys
var firebase = new Firebase(keys.firebase);

// If a development Firebase app exists, keep it commented out
// var firebase = new Firebase(keys.firebaseDev);

module.exports = function() {

  // Clear out all previous news
  firebase.remove();

  // NYTimes API request with params
  var nytAPI = 'http://api.nytimes.com/svc/mostpopular/v2/mostviewed/';

  // NYTimes API param for number of days aggregated
  var daysKey = '/1?';

  // Every section we want to query.
  // Key is the title for the UI, and value is the API section reference.
  var sections = {
    'Top News': 'all-sections',
    US: 'national',
    World: 'world',
    Opinion: 'opinion',
    Tech: 'technology',
    Science: 'science',
  };

  // Overall function for gathering data.
  var gatherNews = function(section, title) {
    // Query NYTimes API
    request(nytAPI + section + daysKey + keys.nytimes, function(error, response, body) {
      // Check for errors
      if (!error && response.statusCode === 200) {
        // Parse the JSON data
        var info = JSON.parse(body);

        // Retrieve just the top 5 results from this section
        for (var i = 0; i < 5; i++) {
          // Pass iteration variable into IIFE due to asynchronicity
          (function(num) {
            // Query Alchemy API for sentiment analysis of each article
            alchemyapi.keywords('url', info.results[num].url, {sentiment: 1}, function(response) {
              // Pass the title on to the response object
              response.title = info.results[num].title;

              // Push results to Firebase
              firebase.child(title).child(num).set(response);
            });
          })(i);
        }
      }
    });
  };

  // Gather data for each of the sections
  for (var key in sections) {
    gatherNews(sections[key], key);
  }

};
