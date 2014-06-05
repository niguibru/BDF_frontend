'use strict';

angular.module('bochaDeFutbolApp')
  .factory('tweets', function ($http) {
    return {
      getTweets: function(search, count, callback) {
        $http.get('/getTweets', {
          params: { 
            search: search, 
            count: count 
          }
        }).success(function(data){
          callback(data);
        });
      }, 
    };
  });
