'use strict';

angular.module('bochaDeFutbolApp')
  .controller('MatchesCtrl', function ($scope, socket, matches) {
    socket.emit('sendLog', {
      page: 'Fixture'
    });
    
    getAllMatches();
    
    function getAllMatches() {
      matches.get(function(data){
        $scope.allMatches = data;
      })
    }
    
    $scope.dayFilter ='2014/06/00';
    $scope.getMatchesByDate = function(date) {
      $scope.dayFilter = date;
    };
    
  });
