'use strict';

angular.module('bochaDeFutbolApp')
  .controller('GroupsCtrl', function ($scope, teams) {
    getAllTeams();

    function getAllTeams () {
      teams.get(function(data){
        $scope.teamsData = data;
      })
    }
  });
