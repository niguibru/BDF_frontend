'use strict';

angular.module('bochaDeFutbolApp')
  .controller('TeamsCtrl', function ($scope, $rootScope, $location, teams) {

    if ($rootScope.teamsData.length == 0) getAllTeams();

    function getAllTeams () {
      teams.get(function(data){
        $rootScope.teamsData = data;
      })
    }
    
    $scope.go = function ( path ) {
      $location.path( path );
    };
    
  });
