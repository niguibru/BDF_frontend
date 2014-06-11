'use strict';

angular.module('bochaDeFutbolApp')
  .controller('TeamdetailsCtrl', function ($scope, $rootScope, $routeParams, teams, tweets) {
    
    if ($rootScope.teamsData.length == 0) 
      getAllTeams();
    else
      getTeamDetails();
    
    function getAllTeams () {
      teams.get(function(data){
        $rootScope.teamsData = data;
        getTeamDetails();
      })
    }
    
    function getTeamDetails() {
      $rootScope.teamsData.forEach(function(teamData) {
        if (teamData.nameId == $routeParams.nameid) {
          $scope.team = teamData;
        }
      });
    }
    
    $scope.teamTwts = [];
    tweets.getTweets('"bdf_'+$routeParams.nameid + '"', 5, function(twtsData){
      $scope.teamTwts = twtsData;
    });
    
  });
