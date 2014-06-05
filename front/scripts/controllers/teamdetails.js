'use strict';

angular.module('bochaDeFutbolApp')
  .controller('TeamdetailsCtrl', function ($scope, $routeParams, teams, tweets) {
    
    teams.getByNameId($routeParams.nameid, function(teamData){
      $scope.team = teamData;
    });
    
    $scope.teamTwts = [];
    tweets.getTweets('"bdf_'+$routeParams.nameid + '"', 5, function(twtsData){
      $scope.teamTwts = twtsData;
    });
  });
