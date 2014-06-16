'use strict';

angular.module('bochaDeFutbolApp')
  .controller('MainCtrl', function ($scope, $rootScope, $location) {

//    $scope.insta = [];
//    instagram.getExample('fifa2014', function(instaData){
//      $scope.insta = instaData;
//    });
    
    
    // Socket
    $rootScope.socketConnect();
    $rootScope.socket.on('actualizeMatch', function (data) {
      for (var i = 0; i < $rootScope.allMatches.length; i++) {
        if ($rootScope.allMatches[i].numId == data.match.numId) {
          $rootScope.allMatches[i] = data.match;
          break;
        }
      }
      $scope.$apply();
    });
    
    $scope.go = function ( path ) {
      $location.path( path );
    };
    
    $scope.yesterdayFilter = moment().subtract('days', 1).format('YYYY/MM/DD');
    $scope.todayFilter = moment().format('YYYY/MM/DD'); 
    $scope.tomorrowFilter = moment().add('days', 1).format('YYYY/MM/DD');
  });
