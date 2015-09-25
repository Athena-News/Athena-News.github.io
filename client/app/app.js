angular.module('athena', [
  'athena.home',
  'athena.world'
])
.config(function($routeProvider) {
  $routeProvider
    .when('/home', {
      templateUrl: 'app/home/home.html',
      controller: 'HomeController'
    })
    .when('/world', {
      templateUrl: 'app/world/world.html',
      controller: 'WorldController'
    })
    .otherwise({
      redirectTo: '/home'
    });
});
