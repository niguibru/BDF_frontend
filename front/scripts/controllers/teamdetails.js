'use strict';

angular.module('bochaDeFutbolApp')
  .controller('TeamdetailsCtrl', function ($scope, $routeParams, socket, teams) {
    socket.emit('sendLog', {
      page: 'teamDetails'
    });
    
    $scope.test = 'holaaaaassssss';
    $scope.testParam = $routeParams.nameid;
  });
