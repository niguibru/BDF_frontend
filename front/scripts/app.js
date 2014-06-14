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
    
    function initVars(){
      $rootScope.twts = [];
      $rootScope.teamsData = [];
      $rootScope.allMatches = [];
      $rootScope.alerts = [];
      $rootScope.alertsIndex = 0;
    }
    initVars();
    
    if ($rootScope.allMatches.length == 0) getAllMatches();
    function getAllMatches() {
      matches.get(function(data){
        $rootScope.allMatches = data;
      })
    }
    
    // Socket
    $rootScope.socketConnect = function(){
//      $rootScope.socket = io.connect('http://10.0.1.5:3000');
    $rootScope.socket = io.connect('http://www.bochadefutbol.com.ar/');
    }
    $rootScope.socketConnect();
    $rootScope.socket.on('newTwits', function (data) {
      $rootScope.twts.unshift(data);
      $rootScope.$digest();
    });
    $rootScope.socket.on('prevTwits', function (data) {
      $rootScope.twts.push(data);
      $rootScope.$digest();
    });
    $rootScope.socket.on('newMatchEvents', function (data) {
      var dateTimeForId = moment().format('YYYY_MM_DD_HH_mm_ss_S');
      var alertId = 'Id_' + dateTimeForId;
      $rootScope.alerts.push({alertId: alertId,type: 'success', msg: data.event});
      $rootScope.$digest();
      window.setTimeout(function() { 
        $('#' + alertId).alert('close'); 
        for(var i = $rootScope.alerts.length - 1; i >= 0; i--) {
          console.log($rootScope.alerts);
          if($rootScope.alerts[i].alertId === alertId) {
            $rootScope.alerts.splice(i, 1);
          }
        }
      }, 10000);
    });
    
  });

