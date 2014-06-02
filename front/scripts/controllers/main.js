'use strict';

angular.module('bochaDeFutbolApp')
  .controller('MainCtrl', function ($scope, $rootScope, socket) {
    socket.emit('sendLog', {
      page: 'Home'
    });
    
    socket.on('newTwits', function (data) {
      $rootScope.twts.unshift(data);
      $rootScope.$digest();
    });
    
    socket.on('prevTwits', function (data) {
      $rootScope.twts.push(data);
      $rootScope.$digest();
    });
        
  });
