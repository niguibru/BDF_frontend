'use strict';

angular.module('bochaDeFutbolApp')
  .factory('instagram', function ($http) {
    return {
      getInstaPrevs: function(lat, long, callback) {
        $http.get('/getInstaPrevs', {
          params: { 
            lat: lat, 
            long: long
          }
        }).success(function(data){
          callback(data);
        });
      }, 
    };
  });
