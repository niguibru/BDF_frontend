'use strict';

angular.module('bochaDeFutbolApp')
  .factory('teams', function ($http) {
    return {
      get: function(callback) {
        $http.get('/teams').success(function(data){
          callback(data);
        });
      },       
    };
  });
