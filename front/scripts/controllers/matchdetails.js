'use strict';

angular.module('bochaDeFutbolApp')
  .controller('MatchdetailsCtrl', function ($scope, $rootScope, $routeParams, matches) {
    $scope.match = {};
    $scope.status = '';
    $scope.statusClass = '';
    $scope.live_minuteShow = '';
    $scope.live_minute = 0;
    $scope.live_minute_percent = 0;
    $scope.events = [];
    
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
          
          // Add events to events array
          matchData.events.goals.forEach(function(goal) {
            var local = '';
            var visitor = '';
            var local_showGoal = false;
            var visitor_showGoal = false;
            if (goal.team == 'local') {
              local = goal.player;
              local_showGoal = true
            }
            if (goal.team == 'visitor') {
              visitor = goal.player;
              visitor_showGoal = true
            }
            $scope.events.push({
              local_showGoal: local_showGoal,
              visitor_showGoal: visitor_showGoal,
              local_showYCard: false,
              visitor_showYCard: false,
              local_showRCard: false,
              visitor_showRCard: false,
              local: local,
              min: goal.minute,
              visitor: visitor
            });
          });
          matchData.events.cards.forEach(function(cards) {
            var local = '';
            var visitor = '';
            var local_showYCard = false;
            var visitor_showYCard = false;
            var local_showRCard = false;
            var visitor_showRCard = false;
            // segunda amarilla y roja es cards.action_type == '4'
            if (cards.team == 'local') {
              local = cards.player;
              if (cards.action_type == '5') local_showYCard = true
              else local_showRCard = true;
            }
            if (cards.team == 'visitor') {
              visitor = cards.player;
              if (cards.action_type == '5') visitor_showYCard = true
              else visitor_showRCard = true;
            }
            $scope.events.push({
              local_showGoal: false,
              visitor_showGoal: false,
              local_showYCard: local_showYCard,
              visitor_showYCard: visitor_showYCard,
              local_showRCard: local_showRCard,
              visitor_showRCard: visitor_showRCard,
              local: local,
              min: cards.minute,
              visitor: visitor
            });
          });
//          matchData.events.changes.forEach(function(changes) {
//            var local = '';
//            if (changes.team == 'local') local = changes.player;
//            var visitor = '';
//            if (changes.team == 'visitor') visitor = changes.player;
//            $scope.events.push({
//              local: local,
//              min: changes.minute,
//              visitor: visitor
//            });
//          });
        }  
      });
    }
    
    
  });
