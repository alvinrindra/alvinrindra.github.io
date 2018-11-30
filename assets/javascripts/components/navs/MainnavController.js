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
        .controller('MainnavController', ['$scope', '$rootScope', '$mdDialog',
        function ($scope, $rootScope , $mdDialog) {

          $scope.lockLeft = true;

          $scope.close = function () {
           // Component lookup should always be available since we are not using `ng-if`
           $mdSidenav('left').close()
             .then(function () {
               $log.debug("close LEFT is done");
             });
         };

         $scope.showTabDialog = function(ev) {
          $mdDialog.show({
            templateUrl: '/assets/partials/tabdialog.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
          })
              .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
              }, function() {
                $scope.status = 'You cancelled the dialog.';
              });
        };


          $rootScope.$on('toggleMainnav', function() {
            $scope.lockLeft = !$scope.lockLeft;
          });
        }
      ]);
});
