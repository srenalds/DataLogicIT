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
      when('/about', {
        templateUrl: 'partials/aboutView.html',
        controller: 'AboutController'
    }).
      otherwise({
        redirectTo: '/'
    });
  }
]);

app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('grey')
      .accentPalette('blue-grey');
});

app.controller('webAppController', ['$scope', '$mdSidenav', '$location', function($scope, $mdSidenav, $location){
  $scope.lockLeft = true;
  $scope.lockRight = true;
  $scope.toggleLeft = function() {
    if ($mdSidenav('left').isOpen()) {
      $mdSidenav('left').close();
      $scope.lockLeft = false;
    } else {
      $mdSidenav('left').toggle();
      $scope.lockLeft = true;
    };
  };
  $scope.toggleRight= function() {
    if ($mdSidenav('right').isOpen()) {
      $mdSidenav('right').close();
      $scope.lockRight = false;
    } else {
      $mdSidenav('right').toggle();
      $scope.lockRight = true;
    };
  };
  $scope.setRoute = function(route) {
    $location.path(route);
  };
}]);

app.controller('PostsController', ['$scope','$http','$route','$routeParams','$location',
  function($scope, $http, $route, $routeParams, $location) {
    $http.get("wp/wp-json/wp/v2/posts")
    .success(function(response) {
      $scope.posts = (function() {
      $scope.authors = { "1" : { "name" : "Steve Renalds" },
                         "2" : { "name" : "Sophia Renalds" }, };
        var p = [];
        for (var i = 0; i < response.length; i++) {
          var authorId = response[i].author;
          var authorName = $scope.authors[authorId].name;
          p.push({
            id: response[i].id,
            date: response[i].date,
            excerpt: response[i].excerpt.rendered,
            content: response[i].content.rendered,
            title: response[i].title.rendered,
            author: authorName
          });
        }
        return p;
      })();
    });
}]);

app.controller('AboutController', ['$scope','$http','$route','$routeParams','$location',
  function($scope, $http, $route, $routeParams, $location) {
    $http.get("wp/wp-json/wp/v2/posts?tag='about'")
    .success(function(response) {
      $scope.posts = (function() {
      $scope.authors = { "1" : { "name" : "Steve Renalds" },
                         "2" : { "name" : "Sophia Renalds" }, };
        var p = [];
        for (var i = 0; i < response.length; i++) {
          var authorId = response[i].author;
          var authorName = $scope.authors[authorId].name;
          p.push({
            id: response[i].id,
            date: response[i].date,
            excerpt: response[i].excerpt.rendered,
            content: response[i].content.rendered,
            title: response[i].title.rendered,
            author: authorName
          });
        }
        return p;
      })();
    });
}]);

app.controller('ViewPostController', ['$scope','$http','$route','$routeParams','$location',
  function($scope, $http, $route, $routeParams, $location) {
    $http.get("wp/wp-json/wp/v2/posts/" + $routeParams.postId)
    .success(function(response) {
      $scope.authors = { "1" : { "name" : "Steve Renalds" },
                         "2" : { "name" : "Sophia Renalds" }, };
      $scope.post = response;
      var authorId = response.author;
      $scope.authorName = $scope.authors[authorId].name;
    })
    .error(function(data,status,headers,config) {$scope.post=data});
}]);
