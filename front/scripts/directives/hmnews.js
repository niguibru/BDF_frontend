'use strict';

angular.module('bochaDeFutbolApp')
  .directive('hmNews', function () {
    return {
      templateUrl: 'views/templates/home/hm-news.html',
      scope: true, 
      link: {
        pre: function preLink(scope, iElement, iAttrs, controller) { 
        },
        post: function postLink(scope, iElement, iAttrs, controller) { 
        }
      }
    };
  });
