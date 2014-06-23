'use strict';

angular.module('bochaDeFutbolApp')
  .directive('mtcListbykey', function () {
    return {
      templateUrl: 'views/templates/matches/mtc-listbykey.html',
      scope: true,
      link: {
        pre: function preLink(scope, iElement, iAttrs, controller) { 
        },
        post: function postLink(scope, iElement, iAttrs, controller) { 
          scope.groupL = iAttrs.key;
        }
      }
    };
  });
