'use strict';

angular.module('bochaDeFutbolApp')
  .directive('mtcListbygroup', function () {
    return {
      templateUrl: 'views/templates/mtc-listbygroup.html',
      scope: true,
      link: {
        pre: function preLink(scope, iElement, iAttrs, controller) { 
        },
        post: function postLink(scope, iElement, iAttrs, controller) { 
          scope.groupL = iAttrs.group;
        }
      }
    };
  });
