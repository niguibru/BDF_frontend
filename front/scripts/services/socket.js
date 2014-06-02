'use strict';

angular.module('bochaDeFutbolApp')
  .factory('socket', function () {
//    var socket = io.connect('http://10.0.1.5:3000');
    var socket = io.connect('http://www.bochadefutbol.com.ar/');
    return socket;
    
  });
