define([
    'angular',
    'jquery'
], function(angular, $) {
    'use strict';
    /**
     * Mainnav module:
     */
    angular.module('autolinks.mainnav', []);
    angular.module('autolinks.mainnav')
        // Mainnav Controller
        .controller('MainnavController', ['$scope', '$rootScope',
        function ($scope, $rootScope) {

          $scope.lockLeft = true;

          $scope.close = function () {
           // Component lookup should always be available since we are not using `ng-if`
           $mdSidenav('left').close()
             .then(function () {
               $log.debug("close LEFT is done");
             });
         };

          $rootScope.$on('toggleMainnav', function() {
            $scope.lockLeft = !$scope.lockLeft;
          });
        }
      ]);
});
