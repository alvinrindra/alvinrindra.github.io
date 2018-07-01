define([
    'angular',
    './components/navs/MainnavController',
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

    app.controller('AppController', ['$scope', '$state', '$mdSidenav', 'EntityService',
        function ($scope, $state, $mdSidenav, EntityService) {

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
