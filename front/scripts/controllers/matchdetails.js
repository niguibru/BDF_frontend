'use strict';

angular.module('bochaDeFutbolApp')
  .controller('MatchdetailsCtrl', function ($scope, $rootScope, $routeParams, matches) {
    $scope.match = {};
    $scope.status = '';
    $scope.statusClass = '';
    $scope.live_minuteShow = '';
    $scope.live_minute = 0;
    $scope.live_minute_percent = 0;
      
    if ($rootScope.allMatches.length == 0) 
      getAllMatches();
    else
      getMatchDetails();
    
    function getAllMatches() {
      matches.get(function(data){
        $rootScope.allMatches = data;
        getMatchDetails()
      })
    }
    
    function getMatchDetails() {
      $rootScope.allMatches.forEach(function(matchData) {
        if (matchData.numId == $routeParams.numid) {
          // Set Match
          $scope.match = matchData;
          
          // Match State
          switch($scope.match.status) {
            case '-1':
              $scope.status = 'A Jugar';
              $scope.statusClass = 'toPlay';
              break;
            case '1':
              $scope.status = 'Jugado';
              $scope.statusClass = 'played';
              break;
            default:
              $scope.status = 'Jugando';
              $scope.statusClass = 'playing';
          }

          // Live Minutes
          if ($scope.match.live_minute == '') {
            $scope.live_minuteShow = 'hidden';
            $scope.live_minute = $scope.match.live_minute;
            $scope.live_minute_percent = $scope.live_minute * 100 / 90;
          }
          
        }  
      });
    }
    
    
  });
