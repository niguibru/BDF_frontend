'use strict';

angular.module('bochaDeFutbolApp')
  .controller('GroupsCtrl', function ($scope, $location, socket, teams) {
    socket.emit('sendLog', {
      page: 'Equipos'
    });
    
    getAllTeams();

    function getAllTeams () {
      teams.get(function(data){
        $scope.teamsData = data;
      })
    }
    
    $scope.go = function ( path ) {
      $location.path( path );
    };
    
  });
