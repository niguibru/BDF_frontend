'use strict';

angular
  .module('bochaDeFutbolApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
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
        templateUrl: 'views/matches.html',
        controller: 'MatchesCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
