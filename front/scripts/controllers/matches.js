'use strict';

angular.module('bochaDeFutbolApp')
  .controller('MatchesCtrl', function ($scope, $rootScope, $location, matches, teams) {

    if ($rootScope.allMatches.length == 0) getAllMatches();
    if ($rootScope.teamsData.length == 0) getAllTeams();
    
    function getAllMatches() {
      matches.get(function(data){
        $rootScope.allMatches = data;
      })
    }
    
    function getAllTeams () {
      teams.get(function(data){
        $rootScope.teamsData = data;
      })
    }
    
    $scope.dayFilter ='2014/06/00';
    $scope.getMatchesByDate = function(date) {
      $scope.dayFilter = date;
    };
    
    $scope.go = function ( path ) {
      $location.path( path );
    };
  });
