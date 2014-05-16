'use strict';

angular.module('bochaDeFutbolApp')
  .controller('MatchesCtrl', function ($scope, matches) {
    getAllMatches();

    function getAllMatches () {
      matches.get(function(data){
        $scope.allMatches = data;
      })
    }
  });
