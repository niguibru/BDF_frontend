'use strict';

angular.module('bochaDeFutbolApp')
  .factory('matches', function ($http) {
    return {
      get: function(callback) {
        $http.get('/matches').success(function(data){
          callback(data);
        });
      },   
      getByDate: function(date, callback) {
        $http.get('/matches', {
          params: { date: date }
        }).success(function(data){
          callback(data);
        });
      },   
    };
  });
