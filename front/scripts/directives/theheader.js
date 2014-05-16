'use strict';

angular.module('bochaDeFutbolApp')
  .directive('theHeader', function () {
    return {
      templateUrl: 'views/templates/the-header.html',
      scope: {},
      link: function postLink(scope, element, attrs) {
        $('#'+attrs.active+'Button').addClass('active');
      }
    };
  });
