'use strict';

angular.module('bochaDeFutbolApp')
  .factory('instagram', function ($http) {
    return {
      getExample: function(search, callback) {
        $http.get('/getExample', {
          params: { 
            search: search, 
          }
        }).success(function(data){
          callback(data);
        });
      }, 
    };
  });
