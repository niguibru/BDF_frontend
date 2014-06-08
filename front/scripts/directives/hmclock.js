'use strict';

angular.module('bochaDeFutbolApp')
  .directive('hmClock', function () {
    return {
      templateUrl: 'views/templates/home/hm-clock.html',
      scope: true, 
      link: {
        pre: function preLink(scope, iElement, iAttrs, controller) { 
        },
        post: function postLink(scope, iElement, iAttrs, controller) { 
        }
      }
    };
  });
