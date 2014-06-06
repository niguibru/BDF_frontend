'use strict';

angular.module('bochaDeFutbolApp')
  .controller('MatchesCtrl', function ($scope, $rootScope, matches) {

    if ($rootScope.allMatches.length == 0) getAllMatches();

    function getAllMatches() {
      matches.get(function(data){
        $rootScope.allMatches = data;
      })
    }
    
    $scope.dayFilter ='2014/06/00';
    $scope.getMatchesByDate = function(date) {
      $scope.dayFilter = date;
    };
    
  });
