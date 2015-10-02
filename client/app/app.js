angular.module('Athena', ['firebase'])

.controller('AppController', function($scope, Data, Options) {

  $scope.categories = Options.newsCategories;

  $scope.graphTypes = Options.graphTypes;

  $scope.selection = {
    graphType: Options.defaultGraphType,
    category: Options.defaultCategory,
  };

  $scope.loadArticle = function(ind) {
    $scope.selection.article = $scope.articles[ind];
    // May not be necessary if already sorted in Firebase
    $scope.selection.article.keywords.sort(function(a, b) {
      return b.relevance - a.relevance;
    });

    $scope.render();
  };

  $scope.changeGraphType = function(graphType) {
    $scope.selection.graphType = graphType;
    $scope.render();
  };

  $scope.loadCategory = function(category) {
    $scope.selection.category = category;
    $scope.articles = $scope.data[category];
    $scope.loadArticle(0);
  };

  $scope.render = function() {
    // Make a copy of keywords array to pass to D3 function
    var keywords = $scope.selection.article.keywords.slice();
    // Render D3 with function associated with current graph type
    $scope.graphTypes[$scope.selection.graphType](keywords);
  };

  Data.getData().then(function(data) {
    $scope.data = data;
    $scope.loadCategory($scope.selection.category);
  });

})

.factory('Data', function($firebaseObject) {

  var getData = function() {

    var firebaseUrl = 'https://boiling-inferno-1345.firebaseio.com/';


    return $firebaseObject(new Firebase(firebaseUrl))
      .$loaded()
      .then(function(data) {
        return data;
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
    console.log(keywords);
  };

  // originally we called the first graph "Pie" but
  // then decided to rename to "Donut" and chose not
  // to rename the D3 files nor the functions in them
  var graphTypes = {
    Donut: createPie,
    'Word Cloud': createWordCloud,
    'Tree Map': createTreeMap,
  };

  var defaultGraphType = 'Donut';

  var newsCategories = [
    'Top News',
    'World',
    'US',
    'Tech',
    'Science',
    'Opinion',
  ];

  var defaultCategory = 'Top News';

  return {
    graphTypes: graphTypes,
    defaultGraphType: defaultGraphType,
    newsCategories: newsCategories,
    defaultCategory: defaultCategory,
  };

});
