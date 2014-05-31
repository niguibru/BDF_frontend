'use strict';

angular
  .module('bochaDeFutbolApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/groups', {
        templateUrl: 'views/groups.html',
        controller: 'GroupsCtrl'
      })
      .when('/matches', {
        templateUrl: 'views/matches/matches.html',
        controller: 'MatchesCtrl'
      })
      .when('/matcheselimin', {
        templateUrl: 'views/matches/matcheselimin.html',
        controller: 'MatchesCtrl'
      })
      .when('/matchesbydate', {
        templateUrl: 'views/matches/matchesbydate.html',
        controller: 'MatchesCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function ($rootScope) {
    $rootScope.twts = [];
  });
