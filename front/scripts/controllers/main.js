'use strict';

angular.module('bochaDeFutbolApp')
  .controller('MainCtrl', function ($scope, socket) {
    $scope.twts = [];
    
    socket.on('news', function (data) {
      if ($scope.twts.length >= 4) $scope.twts.splice(0, 1);
      $scope.twts.push(data);
      $scope.$digest();
    });
    
  });
