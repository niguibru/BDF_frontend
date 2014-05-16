'use strict';

angular.module('bochaDeFutbolApp')
  .directive('grpTeamsbygroup', function () {
    return {
      templateUrl: 'views/templates/grp-teamsbygroup.html',
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
