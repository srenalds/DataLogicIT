var app = angular.module('DataLogicIT', ['ngMaterial','ngSanitize','ngRoute']);
app.config(['$routeProvider','$locationProvider',
  function ($routeProvider,$locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/postsView.html',
        controller: 'PostsController'
    }).
      when('/archives', {
        templateUrl: 'partials/archivesView.html',
        controller: 'PostsController'
    }).
      when('/posts/:postId', {
        templateUrl: 'partials/postView.html',
        controller: 'ViewPostController'
    }).
      otherwise({
        redirectTo: '/'
    });
  }
]);

//app.config(function($mdThemingProvider) {
//    $mdThemingProvider.theme('default')
//      .primaryPalette('grey')
//      .accentPalette('blue-grey');
//});

app.controller('webAppController', ['$scope', '$mdSidenav', function($scope, $mdSidenav){
  $scope.lockLeft = true;
  $scope.lockRight = true;
  $scope.toggleLeft = function() {
    if ($scope.lockLeft) {
      $mdSidenav('left').close();
      $scope.lockLeft = false;
    } else {
      $mdSidenav('left').toggle();
      $scope.lockLeft = true;
    };
  };
  $scope.toggleRight= function() {
    if ($scope.lockRight) {
      $mdSidenav('right').close();
      $scope.lockRight = false;
    } else {
      $mdSidenav('right').toggle();
      $scope.lockRight = true;
    };
  };
}]);

app.controller('PostsController', ['$scope','$http','$route','$routeParams','$location',
  function($scope, $http, $route, $routeParams, $location) {
    $http.get("wp/wp-json/wp/v2/posts")
    .success(function(response) {
      $scope.posts = (function() {
        var p = [];
        for (var i = 0; i < response.length; i++) {
          p.push({
            id: response[i].id,
            date: response[i].date,
            excerpt: response[i].excerpt.rendered,
            content: response[i].content.rendered,
            title: response[i].title.rendered,
            author: "Steve Renalds"
          });
        }
        return p;
      })();
    });
    $scope.setRoute = function(route) {
      $location.path(route);
    };
}]);

app.controller('ViewPostController', ['$scope','$http','$route','$routeParams','$location',
  function($scope, $http, $route, $routeParams, $location) {
    $scope.authors = {"1":"Steve Renalds"};
    $http.get("wp/wp-json/wp/v2/posts/" + $routeParams.postId)
    .success(function(response) {$scope.post = response; $scope.author = authors[response.author];})
    .error(function(data,status,headers,config) {$scope.post=data});
    $scope.setRoute = function(route) {
      $location.path(route);
    };
}]);
