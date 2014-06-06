'use strict';

angular
  .module('bochaDeFutbolApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngAnimate'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/teamsbygroup', {
        templateUrl: 'views/teams/teamsbygroup.html',
        controller: 'GroupsCtrl'
      })
      .when('/teamdetails/:nameid', {
        templateUrl: 'views/teams/teamdetails.html',
        controller: 'TeamdetailsCtrl'
      })
      .when('/matchesbygroup', {
        templateUrl: 'views/matches/matchesbygroup.html',
        controller: 'MatchesCtrl'
      })
      .when('/matcheschampionship', {
        templateUrl: 'views/matches/matcheschampionship.html',
        controller: 'GroupsCtrl'
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
