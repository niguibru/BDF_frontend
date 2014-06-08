'use strict';

angular.module('bochaDeFutbolApp')
  .directive('hmTwitter', function () {
    return {
      templateUrl: 'views/templates/home/hm-twitter.html',
      scope: true, 
      link: {
        pre: function preLink(scope, iElement, iAttrs, controller) { 
        },
        post: function postLink(scope, iElement, iAttrs, controller) { 
        }
      }
    };
  });
