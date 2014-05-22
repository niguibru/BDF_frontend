'use strict';

angular.module('bochaDeFutbolApp')
  .directive('mtcNavlistby', function () {
    return {
      templateUrl: 'views/templates/mtc-navlistby.html',
      scope: {},
      link: function postLink(scope, element, attrs) {
        $('#'+attrs.active).addClass('active');
      }
    };
  });