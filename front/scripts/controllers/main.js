'use strict';

angular.module('bochaDeFutbolApp')
  .controller('MainCtrl', function ($scope, $rootScope, socket) {
    socket.on('news', function (data) {
      if ($rootScope.twts.length >= 4) $rootScope.twts.splice(0, 1);
      $rootScope.twts.push(data);
      $rootScope.$digest();
    });
    
  });
