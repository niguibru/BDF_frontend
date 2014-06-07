'use strict';

angular.module('bochaDeFutbolApp')
  .directive('hmToday', function () {
    return {
      templateUrl: 'views/templates/home/hm-today.html',
      scope: true, 
      link: {
        pre: function preLink(scope, iElement, iAttrs, controller) { 
        },
        post: function postLink(scope, iElement, iAttrs, controller) { 
        }
      }
    };
  });
