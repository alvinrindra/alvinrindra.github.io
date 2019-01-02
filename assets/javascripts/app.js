define([
    'angular',
    './components/navs/MainnavController',
    './components/dialog/DialogController',
    './components/navs/SidenavController',
    './components/navs/CirclenavController',
    './components/network/GraphController',
    './components/network/GraphConfig',
    './services/EntityService',
    './services/EndPointService',
    './services/underscore-module',
    'ui-layout',
    'ui-router',
    'ui-bootstrap',
    'ngMaterial'
], function (angular) {
    'use strict';

    var app = angular.module('autolinks', [
            'ui.layout', 'ui.router', 'ui.bootstrap', 'underscore',  'autolinks.graphConfig', 'autolinks.graph',
            'ngMaterial', 'autolinks.entityservice', 'autolinks.sidenav', 'autolinks.mainnav', 'autolinks.circlenav', 'autolinks.endpointservice'
          ]);

    app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $stateProvider
        .state('layout', {
            views: {
                'mainnav': {
                  controller: 'MainnavController'
                },
                'circlenav': {
                  controller: 'CirclenavController'
                },
                'network': {
                    controller: 'GraphController'
                },
                'sidenav': {
                  controller: 'SidenavController'
                }
            }
        });
        $urlRouterProvider.otherwise('/');
    }]);

    app.controller('AppController', ['$scope', '$state', '$mdSidenav', 'EntityService', '$mdDialog', '$rootScope',
        function ($scope, $state, $mdSidenav, EntityService, $mdDialog, $rootScope) {

            init();

            function init() {
              $state.go('layout');
            }

            function buildToggler(navID) {
              return function() {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav(navID)
                  .toggle()
                  .then(function () {
                    $log.debug("toggle " + navID + " is done");
                  });
              };
            }


            $mdSidenav('right', true).then(function(instance) {

              instance.onClose(function() {
                const temp = $rootScope.oldName;
                if(!$rootScope.createCompound) {
                  cy.$(":selected").data('name', temp);
                }
              });
            });


            if(!localStorage.alvinIntro) {
              showDialog();
            }

            function showDialog($event) {
               var parentEl = angular.element(document.body);
               $mdDialog.show({
                 parent: parentEl,
                 targetEvent: $event,
                 template:
                   '<md-dialog aria-label="List dialog" style="z-index: 1009;">' +
                   '  <md-dialog-content class="md-dialog-content">'+
                   '  <h2 class="md-title"><b> Welcome to alvinrindra.github.io!</b></h2>' +
                   '  <div class="md-dialog-content-body">In this website, you can observe my interactive <i>resume</i>, visualized in the knowledge graphs. </div>' +
                   '  <div class="md-dialog-content-body">You can create a node, a relation, a compound graph, or even build your own <i>knowledge graphs.</i> </div>' +
                   '  <div class="md-dialog-content-body">Click a <i>circle-nav</i> button in the lower right corner to access more features. </div>' +
                   ' </br>' +
                   '  <div class="md-dialog-content-body">*) Better with Chrome browser. </div>' +
                   '  </md-dialog-content>' +
                   '  <md-dialog-actions>' +
                   '    <md-button ng-click="closeDialog()" class="md-primary">' +
                   '      Okay!' +
                   '    </md-button>' +
                   '  </md-dialog-actions>' +
                   '</md-dialog>',
                 locals: {
                   items: $scope.items
                 },
                 controller: DialogController
              });
              function DialogController($scope, $mdDialog, items) {
                $scope.items = items;
                $scope.closeDialog = function() {
                  localStorage.setItem("alvinIntro", "done");
                  $mdDialog.hide();
                }
              }
            };



            $scope.toggleLeft = buildToggler('left');
            $scope.toggleRight = buildToggler('right');

            $scope.isOpenRight = function(){
              return $mdSidenav('right').isOpen();
            };

            $scope.getDisplayEntityGraph = function () {
                return true;
            };
        }]);

    return app;
});
