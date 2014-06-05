'use strict';

angular.module('bochaDeFutbolApp')
  .factory('teams', function ($http) {
    return {
      get: function(callback) {
        $http.get('/teams').success(function(data){
          callback(data);
        });
      },   
      getByNameId: function(nameId, callback) {
        $http.get('/teamsByNameId', {
          params: { nameId: nameId }
        }).success(function(data){
          callback(data);
        });
      },        
    };
  });
