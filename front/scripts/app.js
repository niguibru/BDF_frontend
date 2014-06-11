'use strict';

angular
  .module('bochaDeFutbolApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ui.bootstrap',
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
        controller: 'TeamsCtrl'
      })
      .when('/teamdetails/:nameid', {
        templateUrl: 'views/teams/teamdetails.html',
        controller: 'TeamdetailsCtrl'
      })
      .when('/matches', {
        templateUrl: 'views/matches/matches.html',
        controller: 'MatchesCtrl'
      })
      .when('/matchdetails/:numid', {
        templateUrl: 'views/matches/matchdetails.html',
        controller: 'MatchdetailsCtrl'
      })
      .when('/stadiums', {
        templateUrl: 'views/stadiums/stadiums.html',
        controller: 'MatchesCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function ($rootScope, matches) {
    $rootScope.twts = [];
    $rootScope.teamsData = [];
    $rootScope.allMatches = [];
    $rootScope.alerts = [];
    $rootScope.alertsIndex = 0;
    $('alertsMsg').removeClass('hidden');
    
    if ($rootScope.allMatches.length == 0) getAllMatches();
    function getAllMatches() {
      matches.get(function(data){
        $rootScope.allMatches = data;
      })
    }
    
    //    socket.disconnect():
//    $rootScope.socket = io.connect('http://10.0.1.5:3000');
    $rootScope.socket = io.connect('http://www.bochadefutbol.com.ar/');
    $rootScope.socket.on('newTwits', function (data) {
      $rootScope.twts.unshift(data);
      $rootScope.$digest();
    });
    $rootScope.socket.on('prevTwits', function (data) {
      $rootScope.twts.push(data);
      $rootScope.$digest();
    });
    $rootScope.socket.on('newMatchEvents', function (data) {
      console.log('data.match.numId');
      
      for (var i = 0; i < $rootScope.allMatches.length; i++) {
        if ($rootScope.allMatches[i].numId == data.match.numId) {
          console.log($rootScope.allMatches[i].numId);
          $rootScope.allMatches[i] = data.match;
        }
      }

//      $rootScope.allMatches.forEach(function(match){
////        console.log(match.numId);
//        if (match.numId == data.match.numId) {
//          match = data.match;
//          console.log(match.numId);
//        }
//      });
      console.log($rootScope.allMatches);
      
      $rootScope.alertsIndex = $rootScope.alertsIndex + 1;
      var alertId = "alert" + $rootScope.alertsIndex;
      $rootScope.alerts.push({alertId: alertId,type: 'success', msg: data.event});
      $rootScope.$digest();
      window.setTimeout(function() { $('#' + alertId).alert('close'); }, 4000);
    });
    
  });

