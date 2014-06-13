'use strict';

angular.module('bochaDeFutbolApp')
  .controller('MatchdetailsCtrl', function ($scope, $rootScope, $routeParams, matches) {
    
    initVars();
    function initVars (){
      $scope.match = {};
      $scope.status = '';
      $scope.statusClass = '';
      $scope.live_minuteShow = '';
      $scope.live_minute = 0;
      $scope.live_minute_percent = 0;
      $scope.events = [];
    }
    
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
    
    // Socket
    $rootScope.socketConnect();
    $rootScope.socket.on('actualizeMatch', function (data) {
      for (var i = 0; i < $rootScope.allMatches.length; i++) {
        if ($rootScope.allMatches[i].numId == data.match.numId) {
          $rootScope.allMatches[i] = data.match;
          break;
        }
      }
      initVars();
      getMatchDetails();
      $scope.$apply();
    });
    
    function getMatchDetails() {
      $rootScope.allMatches.forEach(function(matchData) {
        if (matchData.numId == $routeParams.numid) {
          getSelectMatchDetails(matchData);
          return true;
        }
      });
    }
        
    function getSelectMatchDetails(matchData) {
      // Set Match
      $scope.match = matchData;

      // Set Matches data
      setMatchState();
      setLiveMinute();
      
      // Add events to events array
      setGoalEvents_toEventArray(matchData);
      setCardsEvents_toEventArray(matchData);
      setChangesEvents_toEventArray(matchData);
    }
    
    // Match State  
    function setMatchState(){
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
    }
    
    // Live Minutes
    function setLiveMinute(){
      if ($scope.match.live_minute == '') {
        $scope.live_minuteShow = 'hidden';
        $scope.live_minute = $scope.match.live_minute;
        $scope.live_minute_percent = $scope.live_minute * 100 / 90;
      }
    }
    
    // set Goal Events_and save to Event Array
    function setGoalEvents_toEventArray(matchData){
      matchData.events.goals.forEach(function(goal) {
        var local = '';
        var visitor = '';
        var local_showGoal = false;
        var visitor_showGoal = false;
        var local_showOwnGoal = false;
        var local_showPenalty = false;
        var visitor_showOwnGoal = false;
        var visitor_showPenalty = false;
        if (goal.action_type == '6') {
          if (goal.team == 'local') {
            goal.team = 'visitor'
            visitor_showOwnGoal = true;
          } else {
            goal.team = 'local';
            local_showOwnGoal = true;
          }
        } else {
          if (goal.action_type == '2') {  
            if (goal.team == 'local') {
              local_showPenalty = true;
            } else {
              visitor_showPenalty = true;
            }
          }
        }
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
          local_showOwnGoal: local_showOwnGoal,
          visitor_showOwnGoal: visitor_showOwnGoal,
          local_showPenalty: local_showPenalty,
          visitor_showPenalty: visitor_showPenalty,
          local: local,
          min: goal.minute,
          visitor: visitor
        });
      });
    }
    
    // set Cards Events_and save to Event Array
    function setCardsEvents_toEventArray(matchData){
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
          local_showYCard: local_showYCard,
          visitor_showYCard: visitor_showYCard,
          local_showRCard: local_showRCard,
          visitor_showRCard: visitor_showRCard,
          local: local,
          min: cards.minute,
          visitor: visitor
        });
      });
    }
    
    // set Changes Events_and save to Event Array
    function setChangesEvents_toEventArray(matchData){
//      matchData.events.changes.forEach(function(changes) {
//        var local = '';
//        if (changes.team == 'local') local = changes.player;
//        var visitor = '';
//        if (changes.team == 'visitor') visitor = changes.player;
//        $scope.events.push({
//          local: local,
//          min: changes.minute,
//          visitor: visitor
//        });
//      });
    }
    
  });
