angular.module('athena', [])
.controller(function($scope) {
  $scope.data = {};

  // Will be activated when a news
  // category tab is clicked on
  $scope.animateD3 = function(category) {
    // Retrieve data from Firebase
    // retrieve function not yet written
    $scope.data = retrieve(category);

    //Pass data to the d3 animator function
    animate($scope.data);
  };
});