'use strict';

angular.module('bochaDeFutbolApp')
  .directive('hmTomorrow', function () {
    return {
      templateUrl: 'views/templates/home/hm-tomorrow.html',
      scope: true, 
      link: {
        pre: function preLink(scope, iElement, iAttrs, controller) { 
        },
        post: function postLink(scope, iElement, iAttrs, controller) { 
        }
      }
    };
  });
