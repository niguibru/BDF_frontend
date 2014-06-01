'use strict';

angular.module('bochaDeFutbolApp')
  .controller('MainCtrl', function ($scope, $rootScope, socket) {
    socket.on('newTwits', function (data) {
      //if ($rootScope.twts.length >= 4) $rootScope.twts.splice(0, 1);
      $rootScope.twts.unshift(data);
      $rootScope.$digest();
    });
    
    socket.on('prevTwits', function (data) {
      $rootScope.twts.push(data);
      $rootScope.$digest();
    });
    
  });
