'use strict';

angular.module('bochaDeFutbolApp')
  .factory('socket', function () {
    var socket = io.connect('http://localhost:3000');
//    var socket = io.connect('http://www.bochadefutbol.com.ar/');
    return socket;
    
  });
