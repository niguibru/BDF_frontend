'use strict';

angular.module('bochaDeFutbolApp')
  .directive('tmsTeamsbygroup', function () {
    return {
      templateUrl: 'views/templates/tms-teamsbygroup.html',
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
