'use strict';

angular.module('bochaDeFutbolApp')
  .controller('MainCtrl', function ($scope, $rootScope) {
    $scope.pageClass = 'page-home';
    
//    socket.disconnect():
//    var socket = io.connect('http://10.0.1.5:3000');
    var socket = io.connect('http://www.bochadefutbol.com.ar/');
    
//    $scope.insta = [];
//    instagram.getExample('fifa2014', function(instaData){
//      $scope.insta = instaData;
//    });
//    
    
    socket.on('newTwits', function (data) {
      $rootScope.twts.unshift(data);
      $rootScope.$digest();
    });
    
    socket.on('prevTwits', function (data) {
      $rootScope.twts.push(data);
      $rootScope.$digest();
    });
        
  });
