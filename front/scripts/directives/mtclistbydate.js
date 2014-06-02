'use strict';

angular.module('bochaDeFutbolApp')
  .directive('mtcListbydate', function () {
    return {
      templateUrl: 'views/templates/mtc-listbydate.html',
      scope: true,
      link: {
        pre: function preLink(scope, iElement, iAttrs, controller) { 
        },
        post: function postLink(scope, iElement, iAttrs, controller) { 
        }
      }
    };
  });
