'use strict';

angular.module('bochaDeFutbolApp')
  .directive('mtcChampionship', function () {
    return {
      templateUrl: 'views/templates/matches/mtc-championship.html',
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
