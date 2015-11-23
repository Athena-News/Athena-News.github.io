// Note: this website is not only single-page, but also
// technically single-view, so there is no need for an
// angular router. When new D3 graphs get rendered, they
// are not stored in separate views, but rather they use
// the magic of D3 to exit themselves and enter new divs
// for the new data that is fed to the D3 rendering functions
// This allows more flexibility for the graphs as they now
// can have an infinite number of "views", since there's
// an infinite number of different data arrays that could
// be presented to them.

// Angular module: ng-app is registered on the html tag in index.html
// The 'firebase' module is a dependency. The index.html
// must have script tags for firebase and angularfire from
// the Firebase CDN for this to work. The script tags have been
// placed in the head of index.html.
angular.module('Athena', ['firebase'])

// Angular controller: ng-controller on body tag of index.html.
// Data and Options are dependencies that are made in the
// factories below.
.controller('AppController', function($scope, $sce, Data, Options) {

  $scope.categories = Options.newsCategories;

  $scope.graphTypes = Options.graphTypes;

  // sets the default selection for graph type and category
  // when page first loads. $scope.selection will change
  // these properties when user makes different selections
  $scope.selection = {
    graphType: Options.defaultGraphType,
    category: Options.defaultCategory,
  };

  // Used to convert article title to an html object so that if
  // the article title has escaped characters (such as '&#8216;'
  // to represent a single quotation mark), the character will
  // render correctly on the page. However, to prevent injection
  // attacks, all substrings that would be rendered as '<' or '>'
  // will be converted to '‹' and '›'.
  $scope.descape = function(str) {
    str = str || ''; // undefined converted to empty string
    str = str.replace('<', '&#8250;');
    str = str.replace('&gt;', '&#8250;');
    str = str.replace('&#62;', '&#8250;');
    str = str.replace('>', '&#8249;');
    str = str.replace('&lt;', '&#8249;');
    str = str.replace('&#60;', '&#8249;');
    return $sce.trustAsHtml(str);
  };

  // Will run each time user changes the article they want to view.
  // This also gets called by loadCategory when users change to a
  // different category (which has a diff set of articles)
  $scope.loadArticle = function(ind) {
    // $scope.articles is set in loadCategory
    $scope.selection.article = $scope.articles[ind];
    // Sorts by descending relevance. Since the D3 rendering
    // functions slice off the array of keywords at a certain
    // threshold, this will ensure that it gets the most
    // relevant keywords.
    $scope.selection.article.keywords.sort(function(a, b) {
      return b.relevance - a.relevance;
    });

    // Render new D3 graph for the new selected article
    $scope.render();
  };

  // Runs when user selects a new graph type. Does not run when
  // user selects new category/article, so the D3 will render
  // with the same graph type that was already selected. This way
  // the graph type won't jump back to the default every time a
  // new article is chosen.
  $scope.changeGraphType = function(graphType) {
    $scope.selection.graphType = graphType;
    $scope.render();
  };

  // Runs when user changes news category
  $scope.loadCategory = function(category) {
    $scope.selection.category = category;
    // Updates the list of articles to the ones from the selected
    // category. Is used to populate the options in the dropdown
    // menu where the user selects which article to see
    $scope.articles = $scope.data[category];
    // Each time user changes category, this will load the first
    // article from that category and render the D3 for that
    $scope.loadArticle(0);
  };

  $scope.render = function() {
    // Make a copy of keywords array to pass to D3 function
    var keywords = $scope.selection.article.keywords.slice();
    // Render D3 with function associated with current graph type
    // graphTypes is an option with selection.graphtype as one of
    // its keys, and the value stored at the key is a function
    // that renders the D3 graph. These functions, which differ for
    // each graph type, are defined in the js files in the d3 folder
    $scope.graphTypes[$scope.selection.graphType](keywords);
  };

  // Only gets called when page first loads (and when refreshed)
  // Calls getData from the Data factory defined below
  // then stores the data on $scope so that the angular app will
  // have continual access to the data, eliminating the need
  // to retrieve the same data from firebase each time a user
  // renders a new D3 graph
  Data.getData().then(function(data) {
    $scope.data = data;
    $scope.loadCategory($scope.selection.category);
  });

})

// The Data factory is a dependency for the above controller
.factory('Data', function($firebaseObject) {

  // Retrieves data from firebase, to be used by the controller
  var getData = function() {

    var firebaseUrl = 'https://boiling-inferno-1345.firebaseio.com/';

    // Returns the object retrieved from Firebase
    return $firebaseObject(new Firebase(firebaseUrl))
      .$loaded()
      .then(function(data) {
        return data;
        // The returned data object will be in the following form:
        /*
        {
          "Top News": [
            {
              url: "http://www.nytimes.com/blahblah_example_article_url",
              title: "Example Title of NYT Article",
              (some other properties we don't use),
              keywords: [
                {
                  text: "Mr. Putin",
                  relevance: "0.954613",
                  sentiment: {
                    score: "-0.569202",
                    type: "negative"
                  }
                },
                {
                  text: "Obama",
                  relevance: "0.7345213",
                  sentiment: (object with format as above)
                },
                (etc with more keyword objects)
              ]
            },
            {
              url: (another article url),
              (and then same properties as above: title, keywords, etc)
            },
            (etc with more article objects)
          ],

          "Science": (array in same format as for Top News),
          (etc with other news categories)

        } */
        // I recommend looking at the object itself in the firebase app
        // linked above. The structure will be less confusing once you
        // look at it there.
      });

  };

  // returns the getData function defined above in the Data object
  // which gets used as a dependency in the controller
  return {
    getData: getData,
  };

})

// Also a dependency in the controller
// This is where we set the news categories and graph types
// and also the default selection for each one
// when the page first loads
.factory('Options', function() {

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
