'use strict';

angular.module('bochaDeFutbolApp')
  .directive('hmYesterday', function () {
    return {
      templateUrl: 'views/templates/home/hm-yesterday.html',
      scope: true, 
      link: {
        pre: function preLink(scope, iElement, iAttrs, controller) { 
        },
        post: function postLink(scope, iElement, iAttrs, controller) { 
        }
      }
    };
  });
