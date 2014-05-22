'use strict';

angular.module('bochaDeFutbolApp')
  .directive('mtcTeamsbydate', function () {
    return {
      templateUrl: 'views/templates/mtc-teamsbydate.html',
      scope: true,
      link: {
        pre: function preLink(scope, iElement, iAttrs, controller) { 
        },
        post: function postLink(scope, iElement, iAttrs, controller) { 
        }
      }
    };
  });
