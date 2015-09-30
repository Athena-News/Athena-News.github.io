angular.module('Athena', ['firebase'])

.controller('AppController', function($scope, Data, Options) {

  $scope.selection = {};

  $scope.categories = Options.newsCategories;

  $scope.graphTypes = Options.graphTypes;

  $scope.selection.graphType = 'Pie';

  // Will be activated when a news
  // category tab is clicked on
  $scope.getData = function(category) {
    console.log('animateD3 has run');
    // Retrieve data from Firebase
    // Then load first article

    Data.getData(category).then(function(articles) {
      $scope.articles = articles;
      $scope.loadArticle(0);
    });

  };

  $scope.loadArticle = function(ind) {
    console.log('loadArticle was run');
    $scope.selection.article = $scope.articles[ind];
    // May not be necessary if already sorted in Firebase
    $scope.selection.article.keywords.sort(function(a, b) {
      return b.relevance - a.relevance;
    });

    // Make a copy of keywords array to pass to D3 function
    var keywords = $scope.selection.article.keywords.slice();

    // Renders D3
    $scope.graphTypes[$scope.selection.graphType](keywords);

  };

  $scope.changeGraphType = function(graphType) {
    $scope.selection.graphType = graphType;

    // Make a copy of keywords array to pass to D3 function
    var keywords = $scope.selection.article.keywords.slice();

    // Renders D3
    $scope.graphTypes[$scope.selection.graphType](keywords);

  }

  $scope.getData('topNews');



})

.factory('Data', function($firebaseObject) {
  //will hook to firebase instead of returning dummy data
  var getData = function(category) {
    console.log('getData has run');

    var firebaseUrl = 'https://boiling-inferno-1345.firebaseio.com/'; //will update


    return $firebaseObject(new Firebase(firebaseUrl))
      .$loaded()
      .then(function(data) {
        return data[category];
      });

  };

  return {
    getData: getData,
  };

})

.factory('Options', function() {

  //temporary, will delete when d3 function ready
  var create = function(keywords)  {
    console.log('d3 got rendered');
    console.log(this);
    console.log('just logged keywords in create')
  };

  var graphTypes = {
    Pie: createPie,
    'Word Cloud': create,
    'Bar Graph': create,
  };

  var newsCategories = [
    'topNews',
    'World',
    'US',
    'Politics',
    'Tech',
    'Science',
  ];

  return {
    graphTypes: graphTypes,
    newsCategories: newsCategories,
  };

});
